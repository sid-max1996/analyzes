"use strict";
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

//getSelections
exports.getSelections = function(req, res, next) {
    let params = req.body;
    log.debug(`getSelections: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['fetch', 'offset'], checkers: [check.isFetch, check.isOffset] })
        .then(() => Promise.resolve(query.paramThen(methods.getSelections, params)))
        .then(query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getAddSelection
exports.getAddSelection = function(req, res, next) {
    let params = req.body;
    log.debug(`getAddSelection: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['fetch', 'offset'], checkers: [check.isFetch, check.isOffset] })
        .then(() => Promise.resolve(query.paramThen(methods.getAddSelection, params)))
        .then(query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//addSelection
exports.addSelection = function(req, res, next) {
    let params = req.body;
    log.debug(`addSelection: sessionId = ${params.sessionId}`);
    valid.checkers({
            obj: params,
            props: ['selName', 'groupId'],
            checkers: [check.notEmpty, check.isNum]
        })
        .then(() => db.tran.thenData(pool.anal, methods.addSelection, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getSelGroupCols
exports.getSelGroupCols = function(req, res, next) {
    let params = req.body;
    log.debug(`getSelGroupCols: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId'], [check.isNum]))
        .then(() => methods.getSelGroupCols(params))
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getSelItems
exports.getSelItems = function(req, res, next) {
    let params = req.body;
    log.debug(`getSelItems: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['filter', 'selId'], checkers: [check.isObj, check.isNum] })
        .then(() => db.query.paramThen(methods.getSelItems, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

//pushSelItems
exports.pushSelItems = function(req, res, next) {
    let params = req.body;
    log.debug(`pushSelItems: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['selId', 'ids'], checkers: [check.isNum, check.isArr] })
        .then(() => db.tran.thenData(pool.anal, methods.pushSelItems, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getSelInfo
exports.getSelInfo = function(req, res, next) {
    let params = req.body;
    log.debug(`getSelInfo: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['selId'], checkers: [check.isNum] })
        .then(() => db.tran.thenData(pool.anal, methods.getSelInfo, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeSelItems
exports.removeSelItems = function(req, res, next) {
    let params = req.body;
    log.debug(`removeSelItems: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['selId'], checkers: [check.isNum] })
        .then(() => db.tran.thenData(pool.anal, methods.removeSelItems, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//removeSel
exports.removeSel = function(req, res, next) {
    let params = req.body;
    log.debug(`removeSel: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['selId'], checkers: [check.isNum] })
        .then(() => db.tran.thenData(pool.anal, methods.removeSel, params))
        .then((out) => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getStatisticsInfo
exports.getStatisticsInfo = function(req, res, next) {
    let params = req.body;
    log.debug(`getStatisticsInfo: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId'], [check.isNum]))
        .then(() => methods.getStatisticsInfo(params))
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getStatCalcCols
exports.getStatCalcCols = function(req, res, next) {
    let params = req.body;
    log.debug(`getStatCalcCols: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId', 'cols'], [check.isNum, check.isArr]))
        .then(() => db.query.paramThen(methods.getStatCalcCols, params))
        .then(db.query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getStatCalcFilters
exports.getStatCalcFilters = function(req, res, next) {
    let params = req.body;
    log.debug(`getStatCalcFilters: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId', 'filters'], [check.isNum, check.isArr]))
        .then(() => db.query.paramThen(methods.getStatCalcFilters, params))
        .then(db.query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getStatCalcAlleles
exports.getStatCalcAlleles = function(req, res, next) {
    let params = req.body;
    log.debug(`getStatCalcAlleles: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId', 'cols'], [check.isNum, check.isArr]))
        .then(() => db.query.paramThen(methods.getStatCalcAlleles, params))
        .then(db.query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}

//getStatCalcXiSquere
exports.getStatCalcXiSquere = function(req, res, next) {
    let params = req.body;
    log.debug(`getStatCalcXiSquere: sessionId = ${params.sessionId}`);
    valid.checkers(valid.paramCheckers(params, ['selId1', 'selId2', 'cols'], [check.isNum, check.isNum, check.isArr]))
        .then(() => db.query.paramThen(methods.getStatCalcXiSquere, params))
        .then(db.query.thenData)
        .then(out => res.json(out))
        .catch((err) => next(new JsonError(err)));
}