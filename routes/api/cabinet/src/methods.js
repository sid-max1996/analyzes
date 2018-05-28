const lib = require('../../../../core/lib');
const back = require('../../../../core/back');
const before = require('./before');
const after = require('./after');
const log = back.log(module);
const query = back.db.query;
const access = back.protect.access;
const session = back.session;
const object = lib.meta.object;

const paramData = function(params, queryFun, befFunName, aftFunName) {
    return query.paramData(params, before[befFunName], queryFun, after[aftFunName ? aftFunName : befFunName]);
}

exports.getCabinet = function(sessionId) {
    return new Promise((resolve, reject) => {
        access.check(sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(paramData(userId, query.one, 'getCabinet')))
            .catch(err => reject);
    });
}

exports.getAnketa = function(sessionId) {
    return new Promise((resolve, reject) => {
        access.check(sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(paramData(userId, query.one, 'getAnketa')))
            .catch(err => reject);
    });
}

exports.saveAnketa = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(
                paramData(object.setProps(params, ['userId'], [userId]), query.one, 'saveAnketa')))
            .catch(err => reject);
    });
}

exports.getSettings = function(sessionId) {
    return new Promise((resolve, reject) => {
        access.check(sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(paramData(userId, query.one, 'getSettings')))
            .catch(err => reject);
    });
}

exports.saveSettings = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(
                paramData(object.setProps(params, ['userId'], [userId]), query.one, 'saveSettings')))
            .catch(err => reject);
    });
}