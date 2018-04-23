const log = require(appRoot + '/modules/log')(module);
const Access = require(appRoot + '/modules/access').Access;
const AccessError = require(appRoot + '/modules/error').AccessError;
const HttpError = require(appRoot + '/modules/error').HttpError;

exports.trimOrNull = function(value) {
    if (typeof value != "string")
        return null;
    return value ? value.trim() : null;
}

exports.checkAccess = async(sessionId, isAccessCheck, actionName = 'simpleAction') => {
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