const protect = require(appRoot + "/modules/protect.js");
const usersDb = require(appRoot + '/modules/fireburd/users');
const session = require(appRoot + '/modules/session');
const log = require(appRoot + '/modules/log')(module);
const HttpError = require(appRoot + '/modules/error').HttpError;
const AuthError = require(appRoot + '/modules/error').AuthError;
const SessionError = require(appRoot + '/modules/error').SessionError;
const helper = require('../common/helper');

const getDbPool = (obj) => {
    return new Promise((resolve, reject) => {
        const pool = usersDb.pool;
        pool.get(function(err, db) {
            if (err) {
                log.error(err.message);
                reject(new HttpError(500, 'Ошибка обращения к бд'));
            }
            resolve({ db: db, obj: obj });
        });
    });
}

const getAuthData = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let login = obj;
        db.query(`execute procedure get_userId_byName('${login}')`,
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                log.info(result);
                if (!result.user_id)
                    reject(new HttpError(406, "Пользователя с таким именем не существует"));
                db.detach();
                let secret = require("crypto").randomBytes(10).toString('hex');
                let authData = {
                    id: result.user_id,
                    login: login,
                    secret: secret
                };
                resolve(authData);
            });
    });
}

const getAuthAnswer = (authData) => {
    return new Promise((resolve, reject) => {
        session.saveAuthInfo(authData)
            .then((auth) => {
                log.debug(auth.toString());
                resolve({
                    authId: auth._id,
                    secret: auth.secret
                });
            })
            .catch((err) => reject(err));
    });
};

exports.getAuth = function(req, res, next) {
    let login = req.body.login;
    log.debug(`login = ${login}`);
    getDbPool(login)
        .then(getAuthData)
        .then(getAuthAnswer)
        .then((answer) => res.json(answer))
        .catch((err) => {
            log.error(err);
            if (err instanceof SessionError) err = new HttpError(500, 'Ошибка Сессии');
            return next(err);
        });
}

const AuthCheckAndPassDecrypt = ({ auth, hashPass }) => {
    return new Promise((resolve, reject) => {
        if (!auth) {
            let err = new HttpError(500, 'Ошибка Сессии')
            log.error(err.message);
            reject(err);
        }
        let password = protect.decrypt(hashPass, auth.secret);
        log.debug(`password = ${password}`);
        getDbPool({ auth: auth, password: password })
            .then(({ db, obj }) => resolve({ db: db, obj: obj }))
            .catch((err) => reject(err));
    });
};

const getSaltByUserId = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let auth = obj.auth;
        let password = obj.password;
        db.query('execute procedure get_passInfo_byId(?)', [auth.id],
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(err);
                }
                let cryptoPass = result.user_pass;
                let salt = result.user_salt;
                log.debug(`cryptoPass = ${cryptoPass} salt ${salt}`);
                resolve({ password: password, salt: salt, cryptoPass: cryptoPass, auth: auth });
            });
    });
};


const checkCryptoPass = ({ hashPass, passForCheck, auth }) => {
    return new Promise((resolve, reject) => {
        log.debug(`hashPass = ${hashPass}`);
        let secret = require("crypto").randomBytes(10).toString('hex');
        let accessString = require("crypto").randomBytes(25).toString('hex');
        if (hashPass === passForCheck) {
            let userData = {
                id: auth.id,
                login: auth.login,
                secret: secret,
                accessString: accessString,
                isAuthorize: true
            };
            session.authorize(userData)
                .then((user) =>
                    resolve({
                        sessionId: user._id,
                        accessString: user.accessString,
                        secret: user.secret
                    }))
                .catch((err) => reject(new HttpError(500, 'Ошибка Сессии')));
        } else {
            reject(new HttpError(406, 'Неверный пароль'));
        }
    });
}

exports.getSession = function(req, res, next) {
    let authId = req.body.authId;
    let hashPass = req.body.hashPass;
    let passForCheck = null;
    let authData = null;
    log.debug(`authId = ${authId} hashPass = ${hashPass}`);
    session.getAuthById(authId)
        .then((auth) => Promise.resolve({ auth: auth, hashPass: hashPass }))
        .then(AuthCheckAndPassDecrypt)
        .then(getSaltByUserId)
        .then(({ password, salt, cryptoPass, auth }) => {
            passForCheck = cryptoPass;
            authData = auth;
            return Promise.resolve({ password: password, salt: salt });
        })
        .then(protect.getHashPassBySalt)
        .then((hashPass) => Promise.resolve({ hashPass: hashPass, passForCheck: passForCheck, auth: authData }))
        .then(checkCryptoPass)
        .then((answer) => res.json(answer))
        .catch((err) => {
            log.error(err);
            if (err instanceof SessionError) err = new HttpError(500, 'Ошибка Сессии');
            return next(err);
        });
}

const isGiveAccess = ({ user, hashAccess }) => {
    return new Promise((resolve, reject) => {
        log.debug(`accessString = ${user.accessString} secret = ${user.secret}`);
        log.debug(`hash = ${protect.makeHash(user.accessString, user.secret)}`);
        let isAccess = hashAccess === protect.makeHash(user.accessString, user.secret);
        let secret = require("crypto").randomBytes(10).toString('hex');
        user.secret = secret;
        user.isAccess = isAccess;
        resolve(user);
    });
};

exports.getAccess = function(req, res, next) {
    let sessionId = req.body.sessionId;
    let hashAccess = req.body.hashAccess;
    session.getUserById(sessionId)
        .then((user) => Promise.resolve({ user: user, hashAccess: hashAccess }))
        .then(isGiveAccess)
        .then(session.updateUser)
        .then((user) =>
            res.json({
                isSuccess: user.isAccess,
                secret: user.secret
            }))
        .catch((err) => {
            log.error(err);
            if (err instanceof SessionError) err = new HttpError(500, 'Ошибка Сессии');
            return next(err);
        });
}

exports.doLogout = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(sessionId)
                    .then((user) => {
                        user.isAuthorize = false;
                        resolve(user);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(session.updateUser)
        .then((user) => {
            res.json({
                isSuccess: !user.isAuthorize
            });
        })
        .catch((err) => next(err));
}

exports.doLogin = function(req, res, next) {
    let sessionId = req.body.sessionId;
    session.getUserById(sessionId)
        .then((user) => {
            user.isAuthorize = true;
            return Promise.resolve(user);
        })
        .then(session.updateUser)
        .then((user) => {
            res.json({
                isSuccess: user.isAuthorize
            });
        })
        .catch((err) => next(err));
}