const session = require(appRoot + '/modules/session');
const log = require(appRoot + '/modules/log')(module);

const verificSet = new Set();
verificSet.add('isDarkScheme');

exports.setValue = function(req, res, next) {
    let sessionId = req.body.sessionId;
    let name = req.body.name;
    let value = req.body.value;
    if (verificSet.has(name)) {
        log.debug('change session value');
        session.getUserById(sessionId)
            .then((user) => {
                user[name] = value;
                return Promise.resolve(user);
            })
            .then(session.updateUser)
            .then((user) => {
                res.json({ isSuccess: true });
            })
            .catch((err) => next(err));
    } else
        res.json({ isSuccess: false });
}

exports.getValue = function(req, res, next) {
    let sessionId = req.body.sessionId;
    let name = req.body.name;
    if (verificSet.has(name)) {
        log.debug('change session value');
        session.getUserById(sessionId)
            .then((user) => {
                let value = user[name];
                return Promise.resolve(value);
            })
            .then((value) => {
                res.json({
                    isSuccess: true,
                    value: value
                });
            })
            .catch((err) => next(err));
    } else
        res.json({ isSuccess: false });
}