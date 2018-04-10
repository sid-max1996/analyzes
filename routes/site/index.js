const log = require(appRoot + '/modules/log')(module);
const Access = require(appRoot + '/modules/access').Access;
const AccessError = require(appRoot + '/modules/error').AccessError;
const HttpError = require(appRoot + '/modules/error').HttpError;

exports.getStartPage = function(req, res) {
    res.render("login.hbs", {
        title: "Вход в систему"
    });
}

exports.getCabinet = async function(req, res, next) {
    try {
        let sessionId = req.cookies.sessionId;
        let access = await new Access();
        let { isAccess, roleId } = await access.isAccess(sessionId, 'getSitePage');
        log.debug(`isAccess = ${isAccess} roleId = ${roleId}`);
        if (isAccess) {
            res.send('cabinet');
        } else
            res.send('не достаточно прав для доступа');
    } catch (err) {
        log.error('getCabinet error');
        if (err instanceof AccessError) {
            switch (err.isServerError) {
                case true:
                    err = new HttpError(500, 'Ошибка обращения к бд');
                case false:
                    err = new HttpError(406, 'Доступ запрещён');
            }
        }
        next(err);
    }
}