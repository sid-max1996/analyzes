const log = require(appRoot + '/modules/log')(module);
const HttpError = require(appRoot + '/modules/error').HttpError;
const helper = require(appRoot + '/modules/helper');

const methods = require('./methods');
const db = require(appRoot + '/modules/db');

exports.getCabinetData = function(req, res, next) {
    let sessionId = req.body.sessionId;
    log.debug(`getCabinetData: sessionId = ${sessionId}`);
    helper.checkAccess(sessionId)
        .then(() => Promise.resolve(sessionId))
        .then(helper.getUserId)
        .then(methods.setCabinetParams)
        .then(db.doUserQuery)
        .then(methods.getCabinetData)
        .then((userData) => {
            res.json(userData);
        })
        .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
}

exports.getAnketaData = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId)
        .then(() => Promise.resolve(sessionId))
        .then(helper.getUserId)
        .then(methods.setAnketaParams)
        .then(db.doUserQuery)
        .then(methods.getAnketaData)
        .then((anketaData) => {
            res.json(anketaData);
        })
        .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
}

exports.saveAnketaData = function(req, res, next) {
    let params = req.body;
    helper.checkAccess(params.sessionId)
        .then(() => Promise.resolve(params.sessionId))
        .then(helper.getUserId)
        .then((userId) => {
            params.userId = userId;
            return Promise.resolve(params);
        })
        .then(methods.saveAnketaParams)
        .then(db.doUserQuery)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
}

exports.getSettingsData = function(req, res, next) {
    let sessionId = req.body.sessionId;
    helper.checkAccess(sessionId)
        .then(() => Promise.resolve(sessionId))
        .then(helper.getUserId)
        .then(methods.setSettingsParams)
        .then(db.doUserQuery)
        .then(methods.getSettingsData)
        .then((settingsData) => {
            res.json(settingsData);
        })
        .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
}

exports.saveSettingsData = function(req, res, next) {
    let params = req.body;
    helper.checkAccess(params.sessionId)
        .then(() => Promise.resolve(params.sessionId))
        .then(helper.getUserId)
        .then((userId) => {
            params.userId = userId;
            return Promise.resolve(params);
        })
        .then(methods.saveSettingsParams)
        .then(db.doUserQuery)
        .then(() => {
            res.json({ success: true });
        })
        .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
}