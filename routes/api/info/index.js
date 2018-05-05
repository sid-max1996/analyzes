const log = require(appRoot + '/modules/log')(module);
const HttpError = require(appRoot + '/modules/error').HttpError;
const helper = require(appRoot + '/modules/helper');
const methods = require('./methods');
const db = require(appRoot + '/modules/db');

exports.getRoleId = function(req, res, next) {
    let sessionId = req.body.sessionId;
    log.debug(`getRoleId: sessionId = ${sessionId}`);
    helper.getUserId(sessionId)
        .then(methods.setRoleIdParams)
        .then(db.doUserQuery)
        .then(methods.getRoleIdData)
        .then((roleData) => {
            res.json(roleData);
        })
        .catch((err) => next(err));
}

exports.getRoleInfo = function(req, res, next) {
    let sessionId = req.body.sessionId;
    log.debug(`getRoleInfo: sessionId = ${sessionId}`);
    methods.setRoleInfoParams()
        .then(db.doUserQuery)
        .then(methods.getRoleInfoData)
        .then((roleInfo) => {
            res.json(roleInfo);
        })
        .catch((err) => next(err));
}

exports.getRoleOption = function(req, res, next) {
    let sessionId = req.body.sessionId;
    log.debug(`getRoleOption: sessionId = ${sessionId}`);
    methods.setRoleInfoParams()
        .then(db.doUserQuery)
        .then(methods.getRoleOptionData)
        .then((roleOption) => {
            res.json(roleOption);
        })
        .catch((err) => next(err));
}