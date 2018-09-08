"use strict";
const back = require('../../../../../../core/back');
const lib = require('../../../../../../core/lib');
const log = back.log(module);
const db = back.db;
const crypto = back.protect.crypto;
const object = lib.meta.object;
const array = lib.meta.array;
const check = lib.valid.check;
const fil = lib.modif.filters;

exports.getUsers = function(params) {
    log.debug(`before: getUsers: params = ${params}`);
    let { fetch, offset, filter } = params;
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let suffix = '';
    let orderSuff = '';
    let values = ['user_id', 'role_id', 'user_name', 'user_email'];
    if (check.notNull(filter) && object.hasProps(filter, ['userId', 'roleId', 'userName', 'userEmail'])) {
        let filArr = object.toArrayByProps(filter, ['userId', 'roleId', 'userName', 'userEmail']);
        let compares = [filArr[0].text, filArr[1].op, filArr[2].text, filArr[3].text];
        let types = array.createByCounts(['eq', 'like'], [2, 2]);
        let argsObj = object.create(['values', 'compares', 'types'], [values, compares, types]);
        suffix = db.sql.whereSuffix(argsObj);
    }
    if (check.notNull(filter) && object.hasProps(filter, ['order', 'dir'])) {
        if (array.has(values, fil.camelToC(filter.order)))
            orderSuff = db.sql.orderSuffix(object.create(['order', 'dir'], [fil.camelToC(filter.order), filter.dir]));
    }
    let body = db.sql.queryBody(['user_id', 'role_id', 'user_name', 'user_email'], 'users');
    let queres = [prefix + body + suffix + orderSuff, `select count(*) from users` + suffix];
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

exports.addUser = function(params) {
    log.debug(`before: addUser: params = `);
    console.log(params);
    return new Promise((resolve, reject) => {
        let query = `execute procedure add_user(?, ?, ?, ?, ?)`;
        let parArr = array.pushObjProps([], params, ['userName', 'roleId', 'email']);
        crypto.getHashPassAndSalt(params.password)
            .then(({ hashPass, salt }) =>
                resolve(db.query.paramOne(db.pool.anal, query, array.merge(parArr, [hashPass, salt]))))
            .catch((err) => reject(err));
    });
}

exports.updateUser = function(params) {
    log.debug(`before: updateUser: params = ${params}`);
    let query = `execute procedure update_user(?, ?, ?, ?)`;
    let args = array.pushObjProps([], params, ['userId', 'roleId', 'userName', 'email']);
    return Promise.resolve(db.query.paramOne(db.pool.anal, query, args));
}

exports.removeUsers = function(params) {
    log.debug(`before: removeUsers: params = ${params}`);
    log.debug(params.idList);
    let query = `execute procedure remove_user(?)`;
    return Promise.resolve(db.query.paramRepeat(db.pool.anal, query, params.idList));
}