const session = require('./session');
const log = require('./log')(module);

const verificSet = new Set();
verificSet.add('isDarkScheme');

exports.setValue = function(req, res, next) {
    let sessionId = req.body.sessionId;
    let name = req.body.name;
    let value = req.body.value;
    if (verificSet.has(name)) {
        log.debug('set session value');
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
        log.debug('get session value');
        session.getUserById(sessionId)
            .then((user) => {
                if (!user) return Promise.reject('неверный sessionId');
                else {
                    let value = user[name];
                    return Promise.resolve(value);
                }
            })
            .then((value) => {
                res.json({
                    success: true,
                    value: value
                });
            })
            .catch((err) => res.json({ success: false, error: err }));
    } else
        res.json({ success: false, error: 'указан неверный параметр' });
}