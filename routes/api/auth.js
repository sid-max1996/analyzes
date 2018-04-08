const protect = require(appRoot + "/modules/protect.js");
const usersDb = require(appRoot + '/modules/fireburd/users');
const session = require(appRoot + '/modules/session');
const log = require(appRoot + '/modules/log')(module);
const HttpError = require(appRoot + '/modules/error').HttpError;
const AuthError = require(appRoot + '/modules/error').AuthError;

exports.getAuth = function(req, res, next) {
    const pool = usersDb.pool;
    let login = req.body.login;
    log.debug(`login = ${login}`);
    pool.get(function(err, db) {
        if (err) {
            log.error(err.message);
            return next(err);
        }
        db.query('execute procedure get_userid_byname(?)', [login],
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    return next(new HttpError(406, err.message));
                }
                if (!result.user_id) {
                    return next(new AuthError("Пользователя с таким именем не существует"));
                }
                log.debug(result.user_id);
                db.detach();
                let secret = require("crypto").randomBytes(10).toString('hex');
                let authData = {
                    id: result.user_id,
                    login: login,
                    secret: secret
                };
                session.saveAuthInfo(authData, (err, auth) => {
                    if (err) {
                        log.error(err);
                        return next(err);
                    }
                    log.debug(auth.toString());
                    res.json({
                        authId: auth._id,
                        secret: auth.secret
                    });
                });
            });
    });
}

exports.getSession = function(req, res, next) {
    const pool = usersDb.pool;
    let authId = req.body.authId;
    let hashPass = req.body.hashPass;
    log.debug(`authId = ${authId} hashPass = ${hashPass}`);
    session.getAuthById(authId, (err, auth) => {
        if (err) {
            log.error(err.message);
            return next(err);
        } else {
            const protect = require(appRoot + "/modules/protect.js");
            let password = protect.decrypt(hashPass, auth.secret);
            log.debug(`password = ${password}`);
            pool.get(function(err, db) {
                if (err) {
                    log.error(err.message);
                    return next(err);
                }
                if (!auth) {
                    let err = new AuthError('Первый шаг авторизации не был пройден');
                    log.error(err.message);
                    return next(err);
                }
                db.query('execute procedure get_passinfo_byid(?)', [auth.id],
                    function(err, result) {
                        let cryptoPass = result.user_pass;
                        let salt = result.user_salt;
                        log.debug(`cryptoPass = ${cryptoPass} salt ${salt}`);
                        protect.getHashPassBySalt(password, salt, function(err, checkCryptoPass) {
                            if (err) {
                                log.error(err.message);
                                return next(err);
                            }
                            log.debug(`checkCryptoPass = ${checkCryptoPass}`);
                            let secret = require("crypto").randomBytes(10).toString('hex');
                            let accessString = require("crypto").randomBytes(25).toString('hex');
                            if (checkCryptoPass === cryptoPass) {
                                let userData = {
                                    id: auth.id,
                                    login: auth.login,
                                    secret: secret,
                                    accessString: accessString,
                                    isAuthorize: true
                                };
                                session.authorize(userData, (err, user) => {
                                    if (err) {
                                        log.error(err.message);
                                        return next(err);
                                    }
                                    res.json({
                                        sessionId: user._id,
                                        accessString: user.accessString,
                                        secret: user.secret
                                    });
                                });
                            } else {
                                return next(new HttpError(406, 'Неверный пароль'));
                            }
                        });
                    });
            });
        }
    });
}

exports.getAccess = function(req, res, next) {
    let sessionId = req.body.sessionId;
    let hashValue = req.body.hashValue;
    session.getUserById(sessionId, function(err, user) {
        if (err) {
            log.error(err.message);
            return next(err);
        }
        let isAccess = hashValue === protect.makeHash(user.accessString, user.secret);
        let secret = require("crypto").randomBytes(10).toString('hex');
        user.secret = secret;
        user.isAccess = isAccess;
        session.updateUser(user, function(err, user) {
            if (err) {
                log.error(err.message);
                return next(err);
            }
            res.json({
                isAccess: isAccess,
                secret: secret
            });
        });
    });
}