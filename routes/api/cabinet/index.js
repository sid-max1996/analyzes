const back = require('../../../core/back');
const methods = require('./src/methods');
const log = back.log(module);
const db = back.db;
const valid = back.valid;
const JsonError = back.error.JsonError;

exports.getCabinet = function(req, res, next) {
    let params = req.body;
    log.debug(`getCabinet: sessionId = ${params.sessionId}`);
    valid.notUnd({ obj: params, props: ['sessionId'] })
        .then(() => db.query.paramThen(methods.getCabinet, params.sessionId))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.getAnketa = function(req, res, next) {
    let params = req.body;
    log.debug(`getAnketa: sessionId = ${params.sessionId}`);
    valid.notUnd({ obj: params, props: ['sessionId'] })
        .then(() => db.query.paramThen(methods.getAnketa, params.sessionId))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.saveAnketa = function(req, res, next) {
    let params = req.body;
    log.debug('cabinet saveAnketa');
    log.debug(params);
    let props = ['firstName', 'secondName', 'phone', 'city', 'workPlace', 'aboutYourself'];
    valid.notUnd({ obj: params, props: props })
        .then(() => db.query.paramThen(methods.saveAnketa, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.getSettings = function(req, res, next) {
    let params = req.body;
    log.debug(`getSettings: sessionId = ${params.sessionId}`);
    valid.notUnd({ obj: params, props: ['sessionId'] })
        .then(() => db.query.paramThen(methods.getSettings, params.sessionId))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.saveSettings = function(req, res, next) {
    let params = req.body;
    valid.notUnd({ obj: params, props: ['email'] })
        .then(() => db.query.paramThen(methods.saveSettings, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}