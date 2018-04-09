const usersDb = require(appRoot + '/modules/fireburd/users');
const session = require(appRoot + '/modules/session');
const HttpError = require(appRoot + '/modules/error').HttpError;
const log = require(appRoot + '/modules/log')(module);

module.exports.Access = class Access {
    constructor() {
        this.rolesList = [];
        return new Promise((resolve, reject) => {
            log.debug('Access constructor');
            const pool = usersDb.pool;
            let self = this;
            pool.get(function(err, db) {
                if (err) {
                    log.error(err.message);
                    reject(err);
                }
                db.query('select role_id, role_name from roles', function(err, result) {
                    if (err) {
                        log.error(err.message);
                        reject(new HttpError(500, 'Ошибка сервера при обращении к базе данных'));
                    }
                    log.debug(result.length);
                    for (let role of result) {
                        log.debug(role);
                        self.rolesList.push(role);
                    }
                    db.detach();
                    resolve(self);
                });
            });
        });
    }

    isAccess(sessionId, userId, actionName) {
        return new Promise((resolve, reject) => {
            log.debug('isAccess');
            session.getUserById(sessionId, function(err, user) {
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка сервера при обращении к базе данных'));
                }
                if (user.isAccess && user.isAuthorize) {
                    user.isAccess = false;
                    session.updateUser(user, function(err, user) {
                        if (err) {
                            log.error(err.message);
                            reject(new HttpError(500, 'Ошибка сервера при обращении к базе данных'));
                        }
                        const pool = usersDb.pool;
                        pool.get(function(err, db) {
                            if (err) {
                                log.error(err.message);
                                reject(err);
                            }
                            db.query(`select role_id from users where user_id = ${userId}`, function(err, result) {
                                if (err) {
                                    log.error(err.message);
                                    reject(new HttpError(500, 'Ошибка сервера при обращении к базе данных'));
                                }
                                if (!result[0].role_id) {
                                    reject(new HttpError(406, "Не удалось установить уровень доступа"));
                                }
                                let roleId = result[0].role_id;
                                log.debug(`roleId = ${roleId}`);
                                db.query(`execute procedure get_roleid_foraction('${actionName}')`, function(err, result) {
                                    if (err) {
                                        log.error(err.message);
                                        reject(new HttpError(500, 'Ошибка сервера при обращении к базе данных'));
                                    }
                                    if (!result.role_id) {
                                        reject(new HttpError(406, "Не удалось установить уровень доступа"));
                                    }
                                    let actionRoleId = result.role_id;
                                    log.debug(`actionRoleId = ${actionRoleId}`);
                                    db.detach();
                                    let isAccess = roleId >= actionRoleId;
                                    resolve({ isAccess: isAccess, roleId: roleId });
                                });
                            });
                        });
                    });
                } else reject(new HttpError(406, 'Доступ запрещён'));
            });
        });
    }
}