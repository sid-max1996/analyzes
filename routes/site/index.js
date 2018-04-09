const log = require(appRoot + '/modules/log')(module);
const Access = require(appRoot + '/modules/access').Access;

exports.getStartPage = function(req, res) {
    res.render("login.hbs", {
        title: "Вход в систему"
    });
}

exports.getCabinet = async function(req, res, next) {
    try {
        let sessionId = req.cookies.sessionId;
        let access = await new Access();
        log.debug(access.rolesList);
        let { isAccess, roleId } = await access.isAccess(sessionId, 23, 'getSitePage');
        log.debug(`isAccess = ${isAccess} roleId = ${roleId}`);
        if (isAccess) {
            // res.render("login.hbs", {
            //     title: "Личный кабинет"
            // });
            res.send('cabinet');
        } else
            res.send('не достаточно прав для доступа');
    } catch (err) {
        log.error('getCabinet error');
        next(err);
    }
}