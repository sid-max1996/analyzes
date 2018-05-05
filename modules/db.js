const usersDb = require('./fireburd/users');
const HttpError = require('./error').HttpError;
const log = require('./log')(module);
const helper = require('./helper');

const getDbPool = (pool) => {
    log.debug(`getDbPool: pool = ${pool}`);
    return new Promise((resolve, reject) => {
        pool.get(function(err, db) {
            if (err) {
                log.error(err.message);
                reject(new HttpError(500, 'Ошибка обращения к бд'));
            }
            resolve(db);
        });
    });
}

const doDbQuery = ({ db, query, params }) => {
    log.debug(`doDbQuery: db = ${db}, query = ${query}, params = ${params}`);
    console.log(params);
    return new Promise((resolve, reject) => {
        db.query(query, params,
            function(err, result) {
                log.debug(`doDbQuery: result = ${result}`);
                console.log(result);
                if (err) {
                    log.error(err.message);
                    reject(new HttpError(500, 'Ошибка обращения к бд'));
                }
                db.detach();
                resolve(result);
            });
    });
}

exports.doUserQuery = ({ query, params }) => {
    log.debug(`doUserQuery: query = ${query}, params = ${params}`);
    return new Promise((resolve, reject) => {
        getDbPool(usersDb.pool)
            .then((db) => Promise.resolve({
                db: db,
                query: query,
                params: params
            }))
            .then(doDbQuery)
            .then((result) => resolve(result))
            .catch((err) => reject(new HttpError(500, 'Ошибка обращения к бд')));
    });
}


exports.doUserQueres = ({ queres, paramsArr }) => {
    log.debug(`doUserQueres: query = ${queres}, params = ${paramsArr}`);
    let resArr = [];
    return new Promise((resolve, reject) => {
        let promise = Promise.resolve();
        for (let i = 0; i <= queres.length; i++) {
            promise = promise.then((result) => {
                    if (result)
                        resArr.push(result);
                    if (i == queres.length) {
                        resolve(resArr);
                        return Promise.resolve();
                    }
                    return exports.doUserQuery({ query: queres[i], params: paramsArr[i] });
                })
                .catch(err => reject(err));
        }
    });
}

exports.doManyUserQuery = ({ query, paramsArr, count }) => {
    log.debug(`doManyUserQuery: query = ${query}, paramsArrarams = ${paramsArr}, count = ${count}`);
    const promises = [];
    for (let i = 0; i < count; i++) {
        promises.push(exports.doUserQuery({ query: query, params: paramsArr[i] }));
    }
    return Promise.all(promises);
}

exports.getWhereSuffix = function(params) {
    let res = '';
    let { values, compares, types } = params;
    let startFlag = false;
    values.forEach((value, ind) => {
        if (!helper.isEmptyOrNull(compares[ind])) {
            if (!startFlag) {
                res = ' where';
                startFlag = true;
            } else res += ' and';
            res += ` ${value}`;
            if (types[ind] == 'eq') res += ` = ${compares[ind]}`;
            if (types[ind] == 'like') res += ` like '%${compares[ind]}%'`;
        }
    });
    return res;
}

exports.getSelectPrefix = function(params) {
    log.info(1);
    console.log(params);
    let res = 'select ';
    if (!helper.isEmptyOrNull(params)) {
        log.info(2);
        let { first, skip } = params;
        if (first) res += `first ${first} `;
        if (skip) res += `skip ${skip} `;
    }
    console.log(res);
    return res;
}