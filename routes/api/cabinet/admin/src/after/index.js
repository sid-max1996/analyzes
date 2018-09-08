"use strict";
const back = require('../../../../../../core/back');
const lib = require('../../../../../../core/lib');
const log = back.log(module);
const object = lib.meta.object;
const array = lib.meta.array;
const modif = lib.modif;
const query = back.db.query;

exports.getUsers = (resArr) => {
    log.debug(`after: getUsers: result = ${resArr}`);
    console.log(resArr);
    let count = resArr[1][0].count;
    let users = modif.transform(resArr[0], [modif.filters.objTrim, modif.filters.objCToCamel]);
    return Promise.resolve(object.create(['count', 'data'], [count, users]));
}

exports.addUser = (result) => {
    log.debug(`after: addUser: result err = ${result.error}`);
    return Promise.resolve(query.jsonSucc(result));
}

exports.updateUser = (result) => {
    log.debug(`after: updateUser: result err = ${result.error}`);
    return Promise.resolve(query.jsonSucc(result));
}

exports.removeUsers = (results) => {
    log.debug(`after: removeUsers: results`);
    console.log(results);
    return Promise.resolve(query.jsonMultSucc(results));
}