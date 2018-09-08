const back = require('../../core/back');
const session = back.session;
const log = back.log(module);
const error = back.error;
const ShowError = error.ShowError;
const JsonError = error.JsonError;
const valid = back.valid;

const verificSet = new Set();
verificSet.add('colorScheme');
verificSet.add('workGroup');
verificSet.add('workSel');

exports.setValue = function(req, res, next) {
    let { sessionId, name, value } = req.body;
    valid.notUnd({ obj: req.body, props: ['sessionId', 'name', 'value'] })
        .then(() => {
            if (verificSet.has(name)) return Promise.resolve();
            else return Promise.reject(new ShowError(error.code('badReq'), error.mess("exist", name)));
        })
        .then(() => Promise.resolve(sessionId))
        .then(session.getUserById)
        .then((user) => {
            user[name] = value;
            return Promise.resolve(user);
        })
        .then(session.updateUser)
        .then(() => res.json({ success: true }))
        .catch((err) => next(new JsonError(err)));
}

exports.getValue = function(req, res, next) {
    let { sessionId, name } = req.body;
    valid.notUnd({ obj: req.body, props: ['sessionId', 'name'] })
        .then(() => {
            if (verificSet.has(name)) return Promise.resolve();
            else return Promise.reject(new ShowError(error.code('badReq'), error.mess("exist", name)));
        })
        .then(() => Promise.resolve(sessionId))
        .then(session.getUserById)
        .then((user) => {
            if (!user) return Promise.reject('неверный sessionId');
            else return Promise.resolve(user[name]);
        })
        .then(val => res.json({ success: true, value: val }))
        .catch((err) => next(new JsonError(err)));
}