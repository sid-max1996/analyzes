const lib = require('../../../../../lib');
const mod = lib.modif;
const fil = lib.modif.filters;
const meta = lib.meta;

exports.objArrConvert = function(dbObjArr) {
    if (!dbObjArr) return [];
    return mod.transform(meta.objArr.propsFunRename(dbObjArr, fil.cToCamel), [fil.objTrim]);
}

exports.objArrListConvert = function(dbObjArrList) {
    if (!dbObjArrList) return [];
    let res = [];
    dbObjArrList.forEach(dbObjArr => {
        res.push(exports.objArrConvert(dbObjArr));
    });
    return res;
}