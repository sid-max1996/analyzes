const usersDb = require(appRoot + '/modules/fireburd/users');
const session = require(appRoot + '/modules/session');
const log = require(appRoot + '/modules/log')(module);
const HttpError = require(appRoot + '/modules/error').HttpError;
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

const getDbUserData = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let user_id = obj;
        db.query(`execute procedure get_user_info('${user_id}')`,
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                db.detach();
                let userData = {
                    userName: helper.trimOrNull(result.user_name),
                    roleName: helper.trimOrNull(result.role_name),
                    aboutYourself: helper.trimOrNull(result.about_yourself),
                    photoPath: helper.trimOrNull(result.photo_path)
                };
                resolve(userData);
            });
    });
}

exports.getUserData = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(sessionId)
                    .then((user) => {
                        resolve(user.id);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(getDbPool)
        .then(getDbUserData)
        .then((userData) => {
            res.json(userData);
        })
        .catch((err) => next(err));
}

const saveDbAnketa = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let params = obj;
        let { userId, firstName, secondName, phone, city, workPlace, aboutYourself } = params;
        console.log(userId);
        db.query(`execute procedure update_anketa('${userId}', '${firstName}', '${secondName}', '${phone}', '${city}', '${workPlace}', '${aboutYourself}')`,
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                db.detach();
                resolve();
            });
    });
}

exports.saveUserAnketa = function(req, res, next) {
    let params = req.body;
    helper.checkAccess(params.sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(params.sessionId)
                    .then((user) => {
                        params.userId = user.id;
                        resolve(params);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(getDbPool)
        .then(saveDbAnketa)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => next(err));
}

const getDbUserAnketa = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let user_id = obj;
        db.query(`execute procedure get_user_anketa('${user_id}')`,
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                db.detach();
                let userData = {
                    firstName: helper.trimOrNull(result.first_name),
                    secondName: helper.trimOrNull(result.second_name),
                    phone: helper.trimOrNull(result.phone),
                    city: helper.trimOrNull(result.city),
                    workPlace: helper.trimOrNull(result.work_place),
                    aboutYourself: helper.trimOrNull(result.about_yourself)
                };
                resolve(userData);
            });
    });
}

exports.getUserAnketa = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(sessionId)
                    .then((user) => {
                        resolve(user.id);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(getDbPool)
        .then(getDbUserAnketa)
        .then((anketaData) => {
            res.json(anketaData);
        })
        .catch((err) => next(err));
}

const getDbUserSettings = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let user_id = obj;
        db.query(`execute procedure get_user_settings('${user_id}')`,
            function(err, result) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                db.detach();
                let userData = {
                    email: helper.trimOrNull(result.email)
                };
                resolve(userData);
            });
    });
}

exports.getUserSettings = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(sessionId)
                    .then((user) => {
                        resolve(user.id);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(getDbPool)
        .then(getDbUserSettings)
        .then((settingsData) => {
            res.json(settingsData);
        })
        .catch((err) => next(err));
}

const saveDbSettings = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let params = obj;
        let { email, password } = params;
        if (password) {
            const protect = require(appRoot + "/modules/protect.js");
            protect.getHashPassAndSalt(password, function(err, resObj) {
                if (err) {
                    log.error(err);
                    reject(err);
                }
                db.query(`execute procedure update_settings('${userId}', '${email}', '${resObj.hashPass}', '${resObj.salt}')`,
                    function(err, result) {
                        if (err) {
                            log.error(err.message);
                            reject(new HttpError(500, 'Ошибка обращения к бд'));
                        }
                        db.detach();
                        resolve();
                    });
            });
        } else {
            db.query(`execute procedure update_settings('${userId}', '${email}', null, null)`,
                function(err, result) {
                    if (err) {
                        log.error(err.message);
                        reject(new HttpError(500, 'Ошибка обращения к бд'));
                    }
                    db.detach();
                    resolve();
                });
        }
    });
}

exports.saveUserSettings = function(req, res, next) {
    let params = req.body;
    helper.checkAccess(params.sessionId, true)
        .then(() => {
            return new Promise((resolve, reject) => {
                session.getUserById(params.sessionId)
                    .then((user) => {
                        params.userId = user.id;
                        resolve(params);
                    })
                    .catch((err) => reject(err));
            });
        })
        .then(getDbPool)
        .then(saveDbSettings)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => next(err));
}