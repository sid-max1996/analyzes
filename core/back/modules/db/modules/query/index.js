const lib = require('../../../../../lib');
const object = lib.meta.object;
const log = require('../../../log')(module);
const check = lib.valid.check;
const error = require('../../../error');
const ShowError = error.ShowError;
const HideError = error.HideError;

const _query = require('./modules/_query');

exports.paramData = function(params, beforeFun, queryFun, afterFun) {
    return object.create(['params', 'beforeFun', 'queryFun', 'afterFun'], [params, beforeFun, queryFun, afterFun]);
}

exports.getData = function({ params, beforeFun, queryFun, afterFun }) {
    return new Promise((resolve, reject) => {
        beforeFun(params)
            .then(queryFun)
            .then(afterFun)
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

exports.paramThen = function(method, params) {
    return object.create(['method', 'params'], [method, params]);
}

exports.thenData = function({ method, params }) {
    return new Promise((resolve, reject) => {
        method(params)
            .then(exports.getData)
            .then(data => resolve(data))
            .catch((err) => reject(err));
    });
}

exports.jsonSucc = function(result) {
    if (check.isObj(result)) {
        let error = result.error;
        let isSucc = error.length == 0 ? true : false;
        let answer = object.create(['success'], [isSucc]);
        if (!isSucc) object.setProps(answer, ['error'], [result.error]);
        return answer;
    } else return { success: true };
}

exports.jsonMultSucc = function(results) {
    if (check.isArr) {
        let allErr = '';
        results.forEach(result => allErr += result.error);
        return exports.jsonSucc(object.create(['error'], [allErr]));
    } else throw new Error('jsonMultSucc param not arr');
}

exports.paramOne = function(pool, query, params) {
    return object.create(['pool', 'query', 'params'], [pool, query, params]);
}

exports.one = ({ pool, query, params }) => {
    log.debug(`one: query = ${query}, params = ${params}`);
    return new Promise((resolve, reject) => {
        _query.getDb(pool)
            .then((db) => Promise.resolve(object.create(['db', 'query', 'params'], [db, query, params])))
            .then(_query.dbQuery)
            .then((result) => resolve(result))
            .catch((err) => reject(new HideError('one fun error')));
    });
}

exports.paramManyOld = function(pools, queres, paramsArr) {
    return object.create(['pools', 'queres', 'paramsArr'], [pools, queres, paramsArr]);
}

exports.manyOld = ({ pools, queres, paramsArr }) => {
    log.debug(`many: query = ${queres}, paramsArr = ${paramsArr}`);
    const promises = [];
    queres.forEach((query, ind) =>
        promises.push(exports.one({ pool: pools[ind], query: query, params: paramsArr[ind] })));
    return Promise.all(promises);
}

exports.paramMany = function(pool, queres, paramsArr) {
    return object.create(['pool', 'queres', 'paramsArr'], [pool, queres, paramsArr]);
}

exports.many = ({ pool, queres, paramsArr }) => {
    log.debug(`many: queres = ${queres}, paramsArr = ${paramsArr}`);
    const promises = [];
    queres.forEach((query, ind) =>
        promises.push(exports.one({ pool: pool, query: query, params: paramsArr ? paramsArr[ind] : [] })));
    return Promise.all(promises);
}


exports.paramRepeat = function(pool, query, paramsArr) {
    return object.create(['pool', 'query', 'paramsArr'], [pool, query, paramsArr]);
}

exports.repeat = ({ pool, query, paramsArr }) => {
    log.debug(`queryRepeat: query = ${query}, paramsArr = `);
    log.debug(paramsArr);
    const promises = [];
    paramsArr.forEach(params =>
        promises.push(exports.one({ pool: pool, query: query, params: params })));
    return Promise.all(promises);
}

exports.paramManyRepeat = function(pools, queres, paramsArrList) {
    return object.create(['pools', 'queres', 'paramsArrList'], [pools, queres, paramsArrList]);
}

exports.manyRepeat = ({ pools, queres, paramsArrList }) => {
    log.debug(`queresRepeat: query = ${queres}, params = ${paramsArrList}`);
    let resArrList = [];
    return new Promise((resolve, reject) => {
        let promise = Promise.resolve();
        for (let i = 0; i <= queres.length; i++) {
            promise = promise.then((result) => {
                    if (result)
                        resArrList.push(result);
                    if (i == queres.length) {
                        resolve(resArrList);
                        return Promise.resolve();
                    }
                    return exports.repeat({ pool: pools[i], query: queres[i], paramsArr: paramsArrList[i] });
                })
                .catch(err => reject(err));
        }
    });
}

exports.paramRepeatMany = function(pool, queres, paramsArrList) {
    return object.create(['pool', 'queres', 'paramsArrList'], [pool, queres, paramsArrList]);
}

exports.repeatMany = ({ pool, queres, paramsArrList }) => {
    log.debug(`queresRepeat: query = ${queres}, params = ${paramsArrList}`);
    let resArrList = [];
    return new Promise((resolve, reject) => {
        let promise = Promise.resolve();
        for (let i = 0; i <= queres.length; i++) {
            promise = promise.then((result) => {
                    if (result)
                        resArrList.push(result);
                    if (i == queres.length) {
                        resolve(resArrList);
                        return Promise.resolve();
                    }
                    return exports.repeat({ pool: pool, query: queres[i], paramsArr: paramsArrList[i] });
                })
                .catch(err => reject(err));
        }
    });
}

/*Transaction*/
exports.paramOneTr = function(tran, query, params) {
    return object.create(['tran', 'query', 'params'], [tran, query, params]);
}

exports.oneTr = ({ tran, query, params }) => {
    log.debug(`one: query = ${query}, params = ${params}`);
    return new Promise((resolve, reject) => {
        let param = object.create(['tran', 'query', 'params'], [tran, query, params ? params : []]);
        _query.dbQueryTr(param)
            .then((res) => resolve(res))
            .catch((err) => reject(new HideError('oneTr fun error')));
    });
}

exports.paramRepeatTr = function(tran, query, paramsArr) {
    return object.create(['tran', 'query', 'paramsArr'], [tran, query, paramsArr]);
}

exports.repeatTr = ({ tran, query, paramsArr }) => {
    log.debug(`queryRepeatTr: query = ${query}, paramsArr = `);
    log.debug(paramsArr);
    const promises = [];
    paramsArr.forEach(params =>
        promises.push(exports.oneTr({ tran: tran, query: query, params: params })));
    return Promise.all(promises);
}

exports.paramManyTr = function(tran, queres, paramsArr) {
    return object.create(['tran', 'queres', 'paramsArr'], [tran, queres, paramsArr]);
}

exports.manyTr = ({ tran, queres, paramsArr }) => {
    log.debug(`manyTr: query = ${queres}, paramsArr = ${paramsArr}`);
    const promises = [];
    queres.forEach((query, ind) =>
        promises.push(exports.oneTr({ tran: tran, query: query, params: paramsArr ? paramsArr[ind] : null })));
    return Promise.all(promises);
}

exports.paramUnion = function(queryFuns, queryParams) {
    return object.create(['queryFuns', 'queryParams'], [queryFuns, queryParams]);
}

exports.union = ({ queryFuns, queryParams }) => {
    log.debug(`unionTr: queryFuns = ${queryFuns}, queryParams = ${queryParams}`);
    const promises = [];
    queryFuns.forEach((queryFun, ind) =>
        promises.push(queryFun(queryParams[ind])));
    return Promise.all(promises);
}

exports.paramNext = function(queryFuns, queryParams, paramFuns, paramNames) {
    return object.create(['queryFuns', 'queryParams', 'paramFuns', 'paramNames'], [queryFuns, queryParams, paramFuns, paramNames]);
}

exports.next = ({ queryFuns, queryParams, paramFuns, paramNames }) => {
    log.debug(`next: queryFuns = ${queryFuns}, queryParams = ${queryParams}, 
        paramFuns = ${paramFuns}, paramNames = ${paramNames}`);
    let resArrList = [];
    let prevRet = {};
    let promise = queryFuns[0](object.setProp(queryParams[0], paramNames[0], paramFuns[0]()));
    return new Promise((resolve, reject) => {
        for (let i = 1; i <= queryFuns.length; i++) {
            promise = promise.then((result) => {
                    resArrList.push(result);
                    console.log(result);
                    if (i === queryFuns.length) {
                        resolve(resArrList);
                        return Promise.resolve();
                    }
                    return queryFuns[i](object.setProp(queryParams[i], paramNames[i], paramFuns[i](result, prevRet)));
                })
                .catch(err => reject(err));
        }
    });
}