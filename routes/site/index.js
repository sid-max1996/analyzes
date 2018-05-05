const log = require(appRoot + '/modules/log')(module);
const helper = require(appRoot + '/modules/helper');
const session = require(appRoot + '/modules/session');

exports.getStartPage = function(req, res) {
    res.render("login.hbs", {
        title: "Вход в систему"
    });
}

exports.getCabinet = async function(req, res, next) {
    let sessionId = req.cookies.sessionId;
    helper.checkAccess(sessionId, false)
        .then(() => {
            session.getUserById(sessionId)
                .then(
                    (user) => {
                        res.render("cabinet.hbs", {
                            title: "Личный кабинет",
                            isDarkScheme: user.isDarkScheme
                        });
                    }
                )
                .catch((err) => Promise.reject(err));
        })
        .catch((err) => next(err));
}