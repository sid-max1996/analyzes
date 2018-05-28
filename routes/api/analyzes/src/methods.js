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

//getGroups
exports.getGroups = function(params) {
    log.debug('getGroups:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(sessId => session.getUserId(params.sessionId))
            .then((userId) => resolve(paramData(object.setProp(params, 'userId', userId), query.next, 'getGroups')))
            .catch(err => reject(err));
    });
}

//getRecords
exports.getRecords = function(params) {
    log.info('getRecords:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(sessId => session.getUserId(params.sessionId))
            .then((userId) => Promise.resolve(object.setProp(params, 'userId', userId)))
            .then(() => modules.group.checkIsInGroup(params.groupId, params.userId))
            .then(() => modules.group.getIsGroupManager(params.groupId, params.userId))
            .then(isManager => resolve(paramData(object.setProp(params, 'showAll', isManager), query.next, 'getRecords')))
            .catch(err => reject(err));
    });
}

//addGroup
exports.addGroup = function(params) {
    log.debug('addGroup:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then(userId => object.setProp(params, 'userId', userId))
            .then(() => Promise.resolve(params.groupName))
            .then(modules.group.checkGroupNotExist)
            .then(() => resolve(paramData(params, query.next, 'addGroup', 'succFun')))
            .catch(err => reject(err));
    });
}

//getAddGroupParams
exports.getAddGroupParams = function(params) {
    log.debug('getAddGroupParams:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then(userId => resolve(paramData(
                object.setProp(params, 'userId', userId), query.many, 'getAddGroupParams')))
            .catch(err => reject(err));
    });
}

//getGroupCols
exports.getGroupCols = function(params) {
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(sessId => before.getGroupCols(params))
            .then(final => resolve(final))
            .catch(err => reject(err));
    });
}

//updateRecord
exports.updateRecord = function(params) {
    log.info('updateAnalyze1:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then((userId) => modules.group.checkIsRecordCreator(params.id, userId))
            .then(() => resolve(paramData(params, query.manyTr, 'updateRecord', 'succFun')))
            .catch(err => reject(err));
    });
}

//addRecords
exports.addRecords = function(params) {
    log.info('addRecords:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => {
                object.setProp(params, 'userId', userId);
                return modules.group.checkIsInGroup(params.groupId, userId);
            })
            .then(userId => resolve(paramData(params, query.manyTr, 'addRecords', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeRecords
exports.removeRecords = function(params) {
    log.info('removeRecords:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => {
                object.setProp(params, 'userId', userId);
                return modules.group.checkIsInGroup(params.groupId, userId);
            })
            .then(() => modules.group.checkIsRecordsCreator(params.groupId, params.userId, params.idList))
            .then(() => resolve(paramData(params, query.repeatTr, 'removeRecords', 'succFun')))
            .catch(err => reject(err));
    });
}

//getGroupSettings
exports.getGroupSettings = function(params) {
    log.info('getGroupSettings:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true)
            .then(session.getUserId)
            .then(userId => resolve(paramData(
                object.setProp(params, 'userId', userId), query.many, 'getGroupSettings')))
            .catch(err => reject(err));
    });
}

//removeGroup
exports.removeGroup = function(params) {
    log.info('removeGroup:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then(userId => modules.group.checkIsCreator(params.groupId, userId))
            .then(() => resolve(paramData(params, query.oneTr, 'removeGroup', 'checkError')))
            .catch(err => reject(err));
    });
}

//changeGroupName
exports.changeGroupName = function(params) {
    log.info('changeGroupName:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then(userId => modules.group.checkIsGroupManager(params.groupId, userId))
            .then(() => resolve(paramData(params, query.oneTr, 'changeGroupName', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeGroupMember
exports.removeGroupMember = function(params) {
    log.info('removeGroupMember:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'removeGroupMember', 'checkError')))
            .catch(err => reject(err));
    });
}

//addGroupMember
exports.addGroupMember = function(params) {
    log.info('removeGroupMember:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'addGroupMember', 'checkError')))
            .catch(err => reject(err));
    });
}

//removeGroupAnalyze
exports.removeGroupAnalyze = function(params) {
    log.info('removeGroupAnalyze:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'removeGroupAnalyze', 'checkError')))
            .catch(err => reject(err));
    });
}

//addGroupAnalyze
exports.addGroupAnalyze = function(params) {
    log.info('addGroupAnalyze:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'addGroupAnalyze', 'checkError')))
            .catch(err => reject(err));
    });
}

//removeGroupAnketa
exports.removeGroupAnketa = function(params) {
    log.info('removeGroupAnketa:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'removeGroupAnketa', 'checkError')))
            .catch(err => reject(err));
    });
}

//addGroupAnketa
exports.addGroupAnketa = function(params) {
    log.info('addGroupAnketa:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(session.getUserId)
            .then((userId) => resolve(paramData(
                object.setProp(params, 'userOp', userId), query.oneTr, 'addGroupAnketa', 'checkError')))
            .catch(err => reject(err));
    });
}

//getColsData
exports.getColsData = function(params) {
    log.info('getColsData:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => resolve(paramData(params, query.many, 'getColsData')))
            .catch(err => reject(err));
    });
}

//getColInfo
exports.getColInfo = function(params) {
    log.info('getColInfo:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, false, false)
            .then(sessId => resolve(paramData(params, query.many, 'getColInfo')))
            .catch(err => reject(err));
    });
}

//addColumn
exports.addColumn = function(params) {
    log.info('addColumn:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkColNotExist({ name: params.name, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'addColumn', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeColumn
exports.removeColumn = function(params) {
    log.info('removeColumn:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkColExist({ id: params.id, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'removeColumn', 'checkError')))
            .catch(err => reject(err));
    });
}

//addOption
exports.addOption = function(params) {
    log.info('addOption:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkOpNotExist({ name: params.name, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'addOption', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeOption
exports.removeOption = function(params) {
    log.info('removeOption:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkOpExist({ id: params.id, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'removeOption', 'checkError')))
            .catch(err => reject(err));
    });
}

//addColOption
exports.addColOption = function(params) {
    log.info('addOption:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkColExist({ id: params.id, type: params.type }))
            .then(() => modules.column.checkOpExist({ id: params.opId, type: params.type }))
            .then(() => modules.column.checkColNotHasOp({ id: params.id, opId: params.opId, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'addColOption', 'succFun')))
            .catch(err => reject(err));
    });
}

//removeColOption
exports.removeColOption = function(params) {
    log.info('removeOption:');
    return new Promise((resolve, reject) => {
        access.check(params.sessionId, true, true, 'manager')
            .then(sessId => modules.column.checkType(params.type))
            .then(() => modules.column.checkColExist({ id: params.id, type: params.type }))
            .then(() => modules.column.checkOpExist({ id: params.id, type: params.type }))
            .then(() => resolve(paramData(params, query.oneTr, 'removeColOption', 'checkError')))
            .catch(err => reject(err));
    });
}