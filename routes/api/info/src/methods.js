const lib = require('../../../../core/lib');
const back = require('../../../../core/back');
const before = require('./before');
const after = require('./after');
const log = back.log(module);
const query = back.db.query;
const access = back.protect.access;
const session = back.session;

const paramData = function(params, queryFun, befFunName, aftFunName) {
    return query.paramData(params, before[befFunName], queryFun, after[aftFunName ? aftFunName : befFunName]);
}

exports.getRoleId = function(sessionId) {
    return new Promise((resolve, reject) => {
        access.check(sessionId, false, false)
            .then(session.getUserId)
            .then(userId => resolve(paramData(userId, query.one, 'getRoleId')))
            .catch(err => reject);
    });
}

exports.getRoleInfo = function(sessionId) {
    return new Promise((resolve, reject) => {
        access.check(sessionId, false, false)
            .then(sessId => resolve(paramData(null, query.one, 'getRoleInfo')))
            .catch(err => reject);
    });
}