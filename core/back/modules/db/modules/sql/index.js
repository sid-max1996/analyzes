const log = require('../../../log')(module);
const check = require('../../../../../lib').valid.check;

exports.whereSuffix = function(params) {
    log.debug('whereSuffix');
    let res = '';
    let { values, compares, types } = params;
    let startFlag = false;
    if (check.isArr(values)) {
        values.forEach((value, ind) => {
            if (check.notEmpty(compares[ind])) {
                if (!startFlag) {
                    res = ' where';
                    startFlag = true;
                } else res += ' and';
                res += ` ${value}`;
                if (types[ind] == 'eq') res += ` = ${compares[ind]}`;
                if (types[ind] == 'like') res += ` like '%${compares[ind]}%'`;
            }
        });
    }
    return res;
}

exports.orderSuffix = function(params) {
    if (check.notNull(params) && check.notUnd(params.order) &&
        (check.isEq(params.dir, 'desc') || check.isEq(params.dir, 'asc'))) {
        let { order, dir } = params;
        return ' order by ' + order + " " + dir;
    }
    return '';
}

exports.selectPrefix = function(params) {
    log.debug('selectPrefix');
    console.log(params);
    let res = 'select ';
    if (check.notNull(params)) {
        log.info(2);
        let { first, skip } = params;
        if (first) res += `first ${first} `;
        if (skip) res += `skip ${skip} `;
    }
    console.log(res);
    return res;
}

exports.queryBody = function(cols, from) {
    log.debug('queryBody');
    let res = '';
    if (check.isArr(cols)) {
        log.info(2);
        let last = cols.length - 1;
        for (let i = 0; i < last; i++)
            res += cols[i] + ", ";
        res += cols[last] + ' from ' + from;
    }
    console.log(res);
    return res;
}