"use strict";
const lib = require('../../../../core/lib');
const back = require('../../../../core/back');
const modules = require('../modules');
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

//getSelections
exports.getSelections = function(params) {
    log.debug('getSelections:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(sessId => session.getUserId(params.sessionId))
            .then((userId) => resolve(paramData(object.setProp(params, 'userId', userId), query.many, 'getSelections')))
            .catch(err => reject(err));
    });
}

//getAddSelection
exports.getAddSelection = function(params) {
    log.debug('getAddSelection:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(sessId => session.getUserId(params.sessionId))
            .then((userId) => resolve(paramData(object.setProp(params, 'userId', userId), query.many, 'getAddSelection')))
            .catch(err => reject(err));
    });
}

//addSelection
exports.addSelection = function(params) {
    log.debug('addSelection:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => object.setProp(params, 'userId', userId))
            .then(() => Promise.resolve({ selName: params.selName, userId: params.userId }))
            .then(modules.selec.checkSelNotExist)
            .then(() => resolve(paramData(params, query.oneTr, 'addSelection', 'succFun')))
            .catch(err => reject(err));
    });
}

//getSelGroupCols
exports.getSelGroupCols = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => before.getSelGroupCols(groupId))
            .then(final => resolve(final))
            .catch(err => reject(err));
    });
}

//getSelItems
exports.getSelItems = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => resolve(paramData(object.setProp(params, 'groupId', groupId), query.one, 'getSelItems')))
            .catch(err => reject(err));
    });
}

//pushSelItems
exports.pushSelItems = function(params) {
    log.debug('pushSelItems:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => modules.selec.checkIdsGroup(groupId, params.ids))
            .then(() => resolve(paramData(params, query.repeatTr, 'pushSelItems', 'succFun')))
            .catch(err => reject(err));
    });
}

//getSelInfo
exports.getSelInfo = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, false, false)
            .then(sessId => resolve(paramData(params, query.many, 'getSelInfo')))
            .catch(err => reject(err));
    });
}

//removeSelItems
exports.removeSelItems = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => resolve(paramData(params, query.oneTr, 'removeSelItems', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeSel
exports.removeSel = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => resolve(paramData(params, query.oneTr, 'removeSel', 'succFun')))
            .catch(err => reject(err));
    });
}

//getStatisticsInfo
exports.getStatisticsInfo = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => {
                object.setProp(params, 'userId', userId)
                return modules.selec.checkSelExist(params.selId, userId);
            })
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => before.getStatisticsInfo(object.setProp(params, 'groupId', groupId)))
            .then(final => resolve(final))
            .catch(err => reject(err));
    });
}

//getStatCalcCols
exports.getStatCalcCols = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => resolve(paramData(object.setProp(params, 'groupId', groupId), query.many, 'getStatCalcCols')))
            .catch(err => reject(err));
    });
}


//getStatCalcFilters
exports.getStatCalcFilters = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => resolve(paramData(object.setProp(params, 'groupId', groupId), query.many, 'getStatCalcFilters')))
            .catch(err => reject(err));
    });
}

//getStatCalcAlleles
exports.getStatCalcAlleles = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId, userId))
            .then(() => modules.selec.getGroupId(params.selId))
            .then(groupId => resolve(paramData(object.setProp(params, 'groupId', groupId), query.many, 'getStatCalcAlleles')))
            .catch(err => reject(err));
    });
}

//getStatCalcXiSquere
exports.getStatCalcXiSquere = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => modules.selec.checkSelExist(params.selId1, object.setProp(params, 'userId', userId).userId))
            .then(() => modules.selec.checkSelExist(params.selId2, params.userId))
            .then(() => modules.selec.getGroupId(params.selId1))
            .then(groupId => resolve(paramData(object.setProp(params, 'groupId', groupId), query.union, 'getStatCalcXiSquere')))
            .catch(err => reject(err));
    });
}