const log = require('./log')(module);
const Access = require('./access').Access;
const AccessError = require('./error').AccessError;
const HttpError = require('./error').HttpError;
const session = require('./session');

exports.trimOrNull = function(value) {
    if (typeof value != "string")
        return null;
    return value ? value.trim() : null;
}

exports.isEmptyOrNull = function(value) {
    let res = value === "" || value === null || value === 'null' || value === undefined;
    return res;
}

exports.getUserId = function(sessionId) {
    log.debug(`getUserId: sessionId = ${sessionId}`);
    return new Promise((resolve, reject) => {
        session.getUserById(sessionId)
            .then((user) => {
                resolve(user.id);
            })
            .catch((err) => reject(err));
    });
}

exports.checkAccess = async(sessionId, isAccessCheck = true, actionName = 'simpleAction') => {
    try {
        let access = await new Access(isAccessCheck);
        let { isAccess, roleId } = await access.isAccess(sessionId, actionName);
        log.debug(`isAccess = ${isAccess} roleId = ${roleId}`);
        if (isAccess) {
            return Promise.resolve(roleId);
        } else
            return Promise.reject(new HttpError(406, 'Не достаточно прав для доступа'));
    } catch (err) {
        log.error('checkAccess error');
        if (err instanceof AccessError) {
            switch (err.isServerError) {
                case true:
                    err = new HttpError(500, 'Ошибка обращения к бд');
                case false:
                    err = new HttpError(406, 'Доступ запрещён');
            }
        }
        return Promise.reject(err);
    }
}