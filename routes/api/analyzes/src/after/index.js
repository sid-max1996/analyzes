"use strict";
const lib = require('../../../../../core/lib');
const back = require('../../../../../core/back');
const log = back.log(module);
const ShowError = back.error.ShowError;
const meta = lib.meta;
const mod = lib.modif;
const fil = mod.filters;
const check = lib.valid.check;
const metaDb = back.db.meta;
const error = back.error;

exports.succFun = (result) => {
    return Promise.resolve({ success: true });
}

exports.checkError = (result) => {
    log.debug(`after: checkError: result err = ${result.error}`);
    return Promise.resolve(back.db.query.jsonSucc(result));
}

//getGroups
exports.getGroups = (resArrList) => {
    log.debug(`after: getGroups1: resArrList = ${resArrList}`);
    let resArr1 = resArrList[0];
    let data = metaDb.objArrConvert(resArr1[0]);
    let count = resArr1[1][0].count;
    resArr2 = resArrList[1];
    resArr2[0].forEach((res, ind) => data[ind]['users'] = mod.transform(meta.objArr.intoArray(res, 'user_name'), [fil.trim]));
    resArr2[1].forEach((res, ind) => data[ind]['creator'] = mod.transform(res[0].user_name, [fil.trim]));
    return Promise.resolve(meta.object.create(['count', 'data'], [count, data]));
}

//getRecords
exports.getRecords = (resArrList) => {
    log.debug(`after: getRecords: result = `);
    let resArr1 = resArrList[0];
    let count = resArr1[0][0].count;
    let mainIds = meta.objArr.intoArray(resArr1[1], 'main_id');
    let resArr2 = resArrList[1];
    let analArr = metaDb.objArrListConvert(resArr2[0]);
    let ankArr = metaDb.objArrListConvert(resArr2[1]);
    let exArr = metaDb.objArrListConvert(resArr2[2]);
    let multArr = metaDb.objArrListConvert(resArr2[3]);
    let ret = meta.object.create(['success', 'mainIds', 'count', 'analyzes'], [true, mainIds, count, analArr]);
    meta.object.setProps(ret, ['anketa', 'extra', 'mult'], [ankArr, exArr, multArr]);
    return Promise.resolve(ret);
}

//getAddGroupParams
exports.getAddGroupParams = (resArr) => {
    log.debug(`after: getAddGroupParams: result = ${resArr}`);
    let count1 = resArr[0][0].count;
    let collectors = metaDb.objArrConvert(resArr[1]);
    let count2 = resArr[2][0].count;
    let managers = metaDb.objArrConvert(resArr[3]);
    let count3 = resArr[4][0].count;
    let analyzes = metaDb.objArrConvert(resArr[5]);
    let count4 = resArr[6][0].count;
    let anketa = metaDb.objArrConvert(resArr[7]);
    let out = meta.object.create(['colCount', 'collectors', 'manCount', 'managers'], [count1, collectors, count2, managers]);
    meta.object.setProps(out, ['analCount', 'analyzes', 'ankCount', 'anketa'], [count3, analyzes, count4, anketa]);
    return Promise.resolve(out);
}

//getGroupSettings
exports.getGroupSettings = (resArr) => {
    log.debug(`after: getGroupSettings: result = ${resArr}`);
    let isCreator = (resArr[0] && check.isArr(resArr[0]) && resArr[0].length !== 0) ||
        (resArr[7] && check.isArr(resArr[7]) && resArr[7].length !== 0);
    let isManager = resArr[1] && check.isArr(resArr[1]) && resArr[1].length !== 0;
    let collectors = metaDb.objArrConvert(resArr[2]);
    let managers = metaDb.objArrConvert(resArr[3]);
    let analyzes = metaDb.objArrConvert(resArr[4]);
    let anketa = metaDb.objArrConvert(resArr[5]);
    let groupName = resArr[6][0].group_name;
    let out = meta.object.create(['isCreator', 'isManager', 'collectors'], [isCreator, isManager, collectors]);
    meta.object.setProps(out, ['managers', 'analyzes', 'anketa'], [managers, analyzes, anketa]);
    meta.object.setProps(out, ['groupName'], [groupName]);
    return Promise.resolve(out);
}

//getColsData
exports.getColsData = (resArr) => {
    log.debug(`after: getColsData: result = ${resArr}`);
    let analResults = metaDb.objArrConvert(resArr[0]);
    let ankAnswers = metaDb.objArrConvert(resArr[1]);
    let analyzes = metaDb.objArrConvert(resArr[2]);
    let anketa = metaDb.objArrConvert(resArr[3]);
    let out = meta.object.create(['analResults', 'ankAnswers'], [analResults, ankAnswers]);
    meta.object.setProps(out, ['analyzes', 'anketa'], [analyzes, anketa]);
    return Promise.resolve(out);
}

//getColInfo
exports.getColInfo = (resArr) => {
    log.debug(`after: getColInfo: result = ${resArr}`);
    let colName = resArr[0][0] ? resArr[0][0].name : 'Не найдено';
    let isExist = true;
    if (resArr[0][0]) isExist = resArr[0][0].choose !== 0 || resArr[0][0].mult !== 0;
    let colOptions = isExist ? metaDb.objArrConvert(resArr[1]) : [];
    let colAddOp = isExist ? metaDb.objArrConvert(resArr[2]) : [];
    let out = meta.object.create(['colName', 'colOptions', 'colAddOp'], [colName, colOptions, colAddOp]);
    return Promise.resolve(out);
}