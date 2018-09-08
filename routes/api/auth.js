const back = require('../../core/back');
const log = back.log(module);
const ShowError = back.error.ShowError;
const crypto = back.protect.crypto;
const access = back.protect.access;
const session = back.session;
const lib = require('../../core/lib');
const check = lib.valid.check;
const object = lib.meta.object;
const db = back.db;

exports.setAuth = function(req, res, next) {
    let login = req.body.login;
    log.debug(`login = ${login}`);
    db.query.one(db.query.paramOne(db.pool.anal, `execute procedure get_userId_byName(?)`, [login]))
        .then(result => {
            log.debug(result);
            return new Promise((resolve, reject) => {
                if (!result.user_id)
                    reject(new ShowError(error.code('accept'), error.mess("exist", "Пользователя с таким именем")));
                let secret = require("crypto").randomBytes(10).toString('hex');
                resolve(object.create(['id', 'login', 'secret'], [result.user_id, login, secret]));
            });
        })
        .then(session.saveAuthInfo)
        .then((auth) => Promise.resolve(object.create(['authId', 'secret'], [auth._id, auth.secret])))
        .then((answer) => res.json(answer))
        .catch((err) => next(err));
}

const getCryptoPass = ({ auth, hashPass }) => {
    return new Promise((resolve, reject) => {
        let password = crypto.decrypt(hashPass, auth.secret);
        let cryptoPass = null;
        if (check.isNull(auth)) reject(new HttpError(400, 'Ошибка Авторизации'));
        db.query.one(db.query.paramOne(db.pool.anal, 'execute procedure get_user_passInfo(?)', [auth.id]))
            .then(result => {
                cryptoPass = result.user_pass;
                return Promise.resolve(result.user_salt)
            })
            .then(salt => Promise.resolve({ password: password, salt: salt }))
            .then(crypto.getHashPassBySalt)
            .then(hashPass => resolve({ hashPass: hashPass, passForCheck: cryptoPass, auth: auth }))
            .catch((err) => reject(err));
    });
};

const checkCryptoPass = ({ hashPass, passForCheck, auth }) => {
    return new Promise((resolve, reject) => {
        log.debug(`hashPass = ${hashPass}`);
        if (check.isEq(hashPass, passForCheck)) {
            let secret = require("crypto").randomBytes(10).toString('hex');
            let accessString = require("crypto").randomBytes(25).toString('hex');
            let props = ['id', 'secret', 'accessString', 'isAuthorize'];
            let values = [auth.id, secret, accessString, true];
            session.createUser(object.create(props, values))
                .then(user =>
                    resolve(object.create(['sessionId', 'accessString', 'secret'], [user._id, user.accessString, user.secret])))
                .catch(err => reject(err));
        } else reject(new ShowError(error.code('accept'), 'Неверный пароль'));
    });
}

exports.setSession = function(req, res, next) {
    let authId = req.body.authId;
    let hashPass = req.body.hashPass;
    log.debug(`authId = ${authId} hashPass = ${hashPass}`);
    session.getAuthById(authId)
        .then((auth) => Promise.resolve({ auth: auth, hashPass: hashPass }))
        .then(getCryptoPass)
        .then(checkCryptoPass)
        .then(answer => res.json(answer))
        .catch((err) => next(err));
}

exports.setAccess = function(req, res, next) {
    let { sessionId, hashAccess } = req.body;
    session.getUserById(sessionId)
        .then((user) => Promise.resolve({ user: user, hashAccess: hashAccess }))
        .then(({ user, hashAccess }) => {
            log.debug(`accessString = ${user.accessString} secret = ${user.secret}`);
            log.debug(`hash = ${crypto.makeHash(user.accessString, user.secret)}`);
            let isAccess = hashAccess === crypto.makeHash(user.accessString, user.secret);
            let secret = require("crypto").randomBytes(10).toString('hex');
            return Promise.resolve(object.setProps(user, ['secret', 'isAccess'], [secret, isAccess]));
        })
        .then(session.updateUser)
        .then((user) =>
            res.json(object.create(['success', 'secret'], [user.isAccess, user.secret])))
        .catch(err => next(err));
}

exports.doLogout = function(req, res, next) {
    let sessionId = req.body.sessionId;
    access.check(sessionId, false, true)
        .then(() => Promise.resolve(sessionId))
        .then(session.getUserById)
        .then((user) => Promise.resolve(object.setProps(user, ['isAuthorize'], [false])))
        .then(session.updateUser)
        .then(user => res.json(object.create(['success'], [!user.isAuthorize])))
        .catch((err) => next(err));
}

exports.doLogin = function(req, res, next) {
    let sessionId = req.body.sessionId;
    access.check(sessionId, true, true)
        .then(() => Promise.resolve(sessionId))
        .then(session.getUserById)
        .then((user) => Promise.resolve(object.setProps(user, ['isAuthorize'], [true])))
        .then(session.updateUser)
        .then(user => res.json(object.create(['success'], [user.isAuthorize])))
        .catch(err => next(err));
}