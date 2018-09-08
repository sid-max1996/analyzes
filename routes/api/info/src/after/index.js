const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const log = back.log(module);
const db = back.db;
const object = lib.meta.object;
const objArr = lib.meta.objArr;
const modif = lib.modif;

exports.getRoleId = (result) => {
    log.debug(`after: getRoleId: result = ${result}`);
    console.log(result);
    return Promise.resolve(object.create(['roleId'], [result[0].role_id]));
}

exports.getRoleInfo = (result) => {
    log.debug(`after: getRoleInfo: result = ${result}`);
    console.log(result);
    return Promise.resolve(modif.transform(
        result, [modif.filters.objTrim, modif.filters.objCToCamel]));
}