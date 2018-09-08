"use strict";
const back = require('../../../../core/back');
const lib = require('../../../../core/lib');
const methods = require('./src/methods');
const log = back.log(module);
const db = back.db;
const valid = back.valid;
const check = lib.valid.check;
const JsonError = back.error.JsonError;
const array = lib.meta.array;
const object = lib.meta.object;

exports.getUsers = function(req, res, next) {
    let params = req.body;
    log.debug(`getUsers: sessionId = ${params.sessionId}`);
    valid.checkers({ obj: params, props: ['fetch', 'offset'], checkers: [check.isFetch, check.isOffset] })
        .then(() => db.query.paramThen(methods.getUsers, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.addUser = function(req, res, next) {
    let params = req.body;
    log.debug(`addUser: sessionId = ${params.sessionId}`);
    let props = ['sessionId', 'userName', 'roleId', 'password', 'email'];
    let checkers = [check.notEmpty, check.notEmpty, check.isRoleId, check.isPassword, check.isEmail];
    valid.checkers({ obj: params, props: props, checkers: checkers })
        .then(() => db.query.paramThen(methods.addUser, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.updateUser = function(req, res, next) {
    let params = req.body;
    log.debug(`updateUser: params`);
    console.log(params);
    let props = ['sessionId', 'userId', 'roleId', 'userName', 'email'];
    let checkers = [check.notEmpty, check.isNum, check.isRoleId, check.notEmpty, check.isEmail];
    valid.checkers({ obj: params, props: props, checkers: checkers })
        .then(() => db.query.paramThen(methods.updateUser, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}

exports.removeUsers = function(req, res, next) {
    let params = req.body;
    log.debug(`removeUsers: sessionId = ${params.sessionId}`);
    let props = ['sessionId', 'idList'];
    let checkers = [check.notEmpty, check.isArr];
    valid.checkers({ obj: params, props: props, checkers: checkers })
        .then(() => db.query.paramThen(methods.removeUsers, params))
        .then(db.query.thenData)
        .then(data => res.json(data))
        .catch((err) => next(new JsonError(err)));
}