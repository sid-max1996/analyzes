const lib = require('../../../core').lib;
const back = require('../../../core').back;
const methods = require('./src/methods');
const log = back.log(module);
const valid = back.valid;
const pool = back.db.pool;
const tran = back.db.tran;
const query = back.db.query;
const db = back.db;
const check = lib.valid.check;
const meta = lib.meta;
const JsonError = back.error.JsonError;
const ShowError = back.error.ShowError;
const error = back.error;

//getGroups
exports.getGroups = function(req, res, next) {
    let params = req.body;
    log.debug(`getGroups: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['fetch', 'offset'], checkers: [check.isFetch, check.isOffset] })
        .then(() => Promise.resolve(query.paramThen(methods.getGroups, params)))
        .then(query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getRecords
exports.getRecords = function(req, res, next) {
    let params = req.body;
    let final = null;
    log.debug(`getRecords: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['fetch', 'offset', 'groupId'], [check.isFetch, check.isOffset, check.isNum]))
        .then(() => Promise.resolve(query.paramThen(methods.getRecords, params)))
        .then(query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addGroup
exports.addGroup = function(req, res, next) {
    let params = req.body;
    log.debug(`addGroup: sessionId = ${params.sessionId}`);
    valid.checkers({
            obj: params,
            props: ['groupName', 'membersIds', 'analIds', 'ankIds'],
            checkers: [check.notEmpty, check.isArr, check.isArr, check.isArr]
        })
        .then(() => db.tran.thenData(pool.anal, methods.addGroup, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getAddGroupParams
exports.getAddGroupParams = function(req, res, next) {
    let params = req.body;
    log.debug(`getAddGroupParams: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['fetch', 'offset'], checkers: [check.isFetch, check.isOffset] })
        .then(() => Promise.resolve(query.paramThen(methods.getAddGroupParams, params)))
        .then(query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getGroupCols
exports.getGroupCols = function(req, res, next) {
    let params = req.body;
    log.debug(`getGroupCols: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId'], [check.isNum]))
        .then(() => methods.getGroupCols(params))
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//updateRecord
exports.updateRecord = function(req, res, next) {
    let params = req.body;
    log.debug(`updateRecord: sessionId = ${params.sessionId}, id = ${params.id} `);
    valid.checkers(valid.paramCheckers(params, ['newRow', 'id'], [check.isObj, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.updateRecord, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeRecords
exports.removeRecords = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeRecords: sessionId = ${params.sessionId}, ids = ${params.idList} `);
    valid.checkers(valid.paramCheckers(params, ['idList', 'groupId'], [check.isArr, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.removeRecords, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addRecords
exports.addRecords = function(req, res, next) {
    let params = req.body;
    log.debug(`addRecords: sessionId = ${params.sessionId}, id = ${params.rows} `);
    valid.checkers(valid.paramCheckers(params, ['rows', 'groupId'], [check.isArr, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.addRecords, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getGroupSettings
exports.getGroupSettings = function(req, res, next) {
    let params = req.body;
    log.debug(`getGroupSettings: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId'], [check.isNum]))
        .then(() => query.thenData(query.paramThen(methods.getGroupSettings, params)))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeGroup
exports.removeGroup = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeGroup: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId'], [check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.removeGroup, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//changeGroupName
exports.changeGroupName = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`changeGroupName: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'groupName'], [check.isNum, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.changeGroupName, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeGroupMember
exports.removeGroupMember = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeGroupMember: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'userId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.removeGroupMember, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addGroupMember
exports.addGroupMember = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeGroupMember: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'userId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.addGroupMember, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeGroupAnalyze
exports.removeGroupAnalyze = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeGroupAnalyze: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'analId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.removeGroupAnalyze, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addGroupAnalyze
exports.addGroupAnalyze = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`addGroupAnalyze: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'analId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.addGroupAnalyze, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeGroupAnketa
exports.removeGroupAnketa = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeGroupAnketa: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'ankId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.removeGroupAnketa, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addGroupAnketa
exports.addGroupAnketa = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`addGroupAnketa: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['groupId', 'ankId'], [check.isNum, check.isNum]))
        .then(() => db.tran.thenData(pool.anal, methods.addGroupAnketa, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getColsData
exports.getColsData = function(req, res, next) {
    let params = req.body;
    log.debug(`getColsData: sessionId = ${params.sessionId}`);
    query.thenData(query.paramThen(methods.getColsData, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getColInfo
exports.getColInfo = function(req, res, next) {
    let params = req.body;
    log.debug(`getColInfo: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['id', 'type'], [check.isNum, check.notEmpty]))
        .then(() => query.thenData(query.paramThen(methods.getColInfo, params)))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addColOption
exports.addColOption = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`addColOption: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['id', 'opId', 'type'], [check.isNum, check.isNum, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.addColOption, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeColOption
exports.removeColOption = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeColOption: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['id', 'opId', 'type'], [check.isNum, check.isNum, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.removeColOption, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addColumn
exports.addColumn = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`addColumn: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['name', 'type'], [check.notEmpty, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.addColumn, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeColumn
exports.removeColumn = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeColumn: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['id', 'type'], [check.notEmpty, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.removeColumn, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addOption
exports.addOption = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`addOption: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['name', 'type'], [check.notEmpty, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.addOption, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeOption
exports.removeOption = function(req, res, next) {
    let params = req.body;
    let send = { sussecc: false, error: 'Ошибка на сервере' };
    log.debug(`removeOption: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['id', 'type'], [check.notEmpty, check.notEmpty]))
        .then(() => db.tran.thenData(pool.anal, methods.removeOption, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}