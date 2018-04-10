const usersDb = require(appRoot + '/modules/fireburd/users');
const session = require(appRoot + '/modules/session');
const AccessError = require(appRoot + '/modules/error').AccessError;
const HttpError = require(appRoot + '/modules/error').HttpError;
const SessionError = require(appRoot + '/modules/error').SessionError;
const log = require(appRoot + '/modules/log')(module);

const getDbPool = (obj) => {
    return new Promise((resolve, reject) => {
        const pool = usersDb.pool;
        pool.get(function(err, db) {
            if (err) {
                log.error(err.message);
                reject(new AccessError('Ошибка при получении pool бд', true));
            }
            resolve({ db: db, obj: obj });
        });
    });
}

const getRolesFromDb = ({ db, obj }) => {
    return new Promise((resolve, reject) => {
        let access = obj;
        db.query('select role_id, role_name from roles', function(err, result) {
            if (err) reject(new AccessError('Ошибка при извлечении списка ролей из бд', true));
            for (let role of result)
                access.rolesList.push(role);
            db.detach();
            resolve(access);
        });
    });
}

const isSessionAccess = function(user) {
    return new Promise((resolve, reject) => {
        if (user.isAuthorize && user.isAccess) {
            user.isAccess = false;
            let userId = user.id;
            session.updateUser(user)
                .then((user) => resolve(userId))
                .catch((err) => reject(err));
        } else
            reject(new AccessError(`авторизован = ${user.isAuthorize} запрашивал доступ = ${user.isAccess}`));
    });
}

const getUserRoleId = function({ db, obj }) {
    return new Promise((resolve, reject) => {
        userId = obj;
        db.query(`select role_id from users where user_id = ${userId}`, function(err, result) {
            if (err) log.error(err.message);
            if (err || !result[0].role_id)
                reject(new AccessError('Ошибка установления роли пользователя', true));
            let roleId = result[0].role_id;
            resolve({ db: db, roleId: roleId });
        });
    });
}


const getIsAccess = function({ db, roleId, actionName }) {
    return new Promise((resolve, reject) => {
        db.query(`execute procedure get_roleId_forAction('${actionName}')`, function(err, result) {
            if (err) log.error(err.message);
            if (err || !result.role_id)
                reject(new AccessError('Ошибка установления роли действия', true));
            let actionRoleId = result.role_id;
            db.detach();
            let isAccess = roleId >= actionRoleId;
            log.debug(`actionRoleId = ${actionRoleId} roleId = ${roleId} isAccess = ${isAccess}`);
            resolve({ isAccess: isAccess, roleId: roleId });
        });
    });
}

exports.Access = class Access {
    constructor() {
        return new Promise((resolve, reject) => {
            this.rolesList = [];
            log.debug('Access constructor');
            getDbPool(this)
                .then(getRolesFromDb)
                .then((access) => resolve(access))
                .catch(err => {
                    log.error(err.message);
                    reject(err);
                });
        });
    }

    isAccess(sessionId, actionName) {
        return new Promise((resolve, reject) => {
            log.debug('isAccess');
            session.getUserById(sessionId)
                .then(isSessionAccess)
                .then(getDbPool)
                .then(getUserRoleId)
                .then(({ db, roleId }) =>
                    Promise.resolve({
                        db: db,
                        roleId: roleId,
                        actionName: actionName
                    }))
                .then(getIsAccess)
                .then((resObj) => resolve(resObj))
                .catch((err) => {
                    log.error(err.message);
                    if (err instanceof SessionError) {
                        err = new HttpError(500, 'Ошибка Сессии');
                    }
                    reject(err);
                });
        });
    }
}