"use strict";
const back = require('../../../core/back');
const log = back.log(module);
const db = back.db;
const valid = back.valid;
const methods = require('./src/methods');
const JsonError = back.error.JsonError;

exports.getRoleId = function(req, res, next) {
    let params = req.body;
    log.debug(`getRoleId: sessionId = ${params.sessionId}`);
    valid.notUnd({ obj: params, props: ['sessionId'] })
        .then(() => db.query.paramThen(methods.getRoleId, params.sessionId))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.getRoleInfo = function(req, res, next) {
    let params = req.body;
    log.debug(`getRoleInfo: sessionId = ${params.sessionId}`);
    valid.notUnd({ obj: params, props: ['sessionId'] })
        .then(() => db.query.paramThen(methods.getRoleInfo, params.sessionId))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}