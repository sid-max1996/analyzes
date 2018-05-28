const lib = require('../../../../../core/lib');
const back = require('../../../../../core/back');
const before = require('./before');
const after = require('./after');
const log = back.log(module);
const db = back.db;
const query = back.db.query;
const access = back.protect.access;
const session = back.session;
const object = lib.meta.object;

const paramData = function(params, queryFun, befFunName, aftFunName) {
    return query.paramData(params, before[befFunName], queryFun, after[aftFunName ? aftFunName : befFunName]);
}

exports.getUsers = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'admin')
            .then(sessId => resolve(paramData(params, db.query.many, 'getUsers')))
            .catch(err => reject);
    });
}

exports.addUser = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'admin')
            .then(sessId => resolve(paramData(params, db.query.one, 'addUser')))
            .catch(err => reject);
    });
}

exports.updateUser = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'admin')
            .then(sessId => resolve(paramData(params, db.query.one, 'updateUser')))
            .catch(err => reject);
    });
}

exports.removeUsers = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'admin')
            .then(sessId => resolve(paramData(params, db.query.repeat, 'removeUsers')))
            .catch(err => reject);
    });
}