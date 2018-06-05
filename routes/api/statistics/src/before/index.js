const lib = require('../../../../../core/lib');
const back = require('../../../../../core/back');
const modules = require('../../modules');
const log = back.log(module);
const db = back.db;
const crypto = back.protect.crypto
const array = lib.meta.array;
const object = lib.meta.object;
const objArr = lib.meta.objArr;
const meta = lib.meta;
const check = lib.valid.check;
const fil = lib.modif.filters;

//getSelections 
exports.getSelections = function(params) {
    log.debug(`before: getSelections: params = ${params}`);
    let { fetch, offset, filter, userId, groupId } = params;
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let filSuff = '';
    if (filter && check.notEmpty(filter.selName)) filSuff = ` and s.sel_name like '${filter.selName}%'`;
    let suff = ` where s.creator_id=${params.userId}`;
    let body = db.sql.queryBody(['s.sel_id', 's.sel_name', 'g.group_name'], 'selection s') +
        ` join groups g on g.group_id=s.group_id`;
    let queres = [prefix + body + suff + filSuff, `select count(*) from selection s` + suff + filSuff];
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getAddSelection 
exports.getAddSelection = function(params) {
    log.debug(`before: getAddSelection: params = ${params}`);
    let { fetch, offset, filter, userId, groupId } = params;
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let filSuff = '';
    if (filter && check.notEmpty(filter.selName)) filSuff = ` and g.group_name like '${filter.groupName}%'`;
    let body = db.sql.queryBody(['g.group_id', 'g.group_name'], 'groups g');
    let queres = [prefix + body + filSuff, `select count(*) from selection s` + filSuff];
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//addSelection 
exports.addSelection = function(params) {
    log.debug(`before: addSelection: params = `);
    let { selName, groupId, userId } = params;
    let query = `insert into selection (sel_name, group_id, creator_id) values(?, ?, ?)`;
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [selName, groupId, userId]));
}

//getGroupCols
exports.getSelGroupCols = function(groupId) {
    log.debug(`before: getGroupCols: params = `);
    console.log(groupId);
    let final = { success: false, error: 'Ошибка на сервере' };
    let queres = [];
    queres.push(`select ag.anal_id id, name from analyzes_group ag join analyzes a on a.anal_id = ag.anal_id
        where group_id = ${groupId}`);
    queres.push(`select ag.ank_id id, question name from anketa_group ag join anketa a on a.ank_id = ag.ank_id
        where a.is_choose = 1 and a.is_text = 0 and a.is_mult = 0 and group_id = ${groupId}`);
    queres.push(`select ag.ank_id id, question name from anketa_group ag join anketa a on a.ank_id = ag.ank_id
        where a.is_choose = 0 and a.is_text = 1 and a.is_mult = 0 and group_id = ${groupId}`);
    queres.push(`select ag.ank_id id, question name from anketa_group ag join anketa a on a.ank_id = ag.ank_id
        where a.is_choose = 1 and a.is_text = 1 and a.is_mult = 0 and group_id = ${groupId}`);
    queres.push(`select ag.ank_id id, question name from anketa_group ag join anketa a on a.ank_id = ag.ank_id
        where a.is_choose = 0 and a.is_text = 0 and a.is_mult = 1 and group_id = ${groupId}`);
    return new Promise((resolve, reject) => {
        db.query.many(db.query.paramMany(db.pool.anal, queres))
            .then((resArr) => {
                let analyzes = db.meta.objArrConvert(resArr[0]);
                let chooseArr = db.meta.objArrConvert(resArr[1]);
                let textArr = db.meta.objArrConvert(resArr[2]);
                let chooseText = db.meta.objArrConvert(resArr[3]);
                let multChoose = db.meta.objArrConvert(resArr[4]);
                let anketa = object.create(['choose', 'text', 'chooseText', 'multChoose'], [chooseArr, textArr, chooseText, multChoose]);
                final = object.create(['analyzes', 'anketa'], [analyzes, anketa]);
                let analIds = meta.objArr.intoPropArrayList(analyzes, 'id');
                let chooseIds = meta.objArr.intoPropArrayList(chooseArr, 'id');
                let chTextIds = meta.objArr.intoPropArrayList(chooseText, 'id');
                let multIds = meta.objArr.intoPropArrayList(multChoose, 'id');
                let queres = [];
                queres.push(`select ao.res_id id, ar.result val from analyzes_options ao join analyzes_results
                     ar on ao.res_id = ar.res_id where ao.anal_id = ?`);
                queres.push(`select ao.ans_id id, aa.answer val from anketa_options ao join anketa_answers aa
                     on ao.ans_id = aa.ans_id where ao.ank_id = ?`);
                queres.push(`select ao.ans_id id, aa.answer val from anketa_options ao join anketa_answers aa
                     on ao.ans_id = aa.ans_id where ao.ank_id = ?`);
                queres.push(`select ao.ans_id id, aa.answer val from anketa_options ao join anketa_answers aa 
                     on ao.ans_id = aa.ans_id where ao.ank_id = ?`);
                db.query.repeatMany(db.query.paramRepeatMany(db.pool.anal, queres, [analIds, chooseIds, chTextIds, multIds]))
                    .then((resArr) => {
                        let results = db.meta.objArrConvert(resArr[0]);
                        let chooseAns = db.meta.objArrConvert(resArr[1]);
                        let chTextAns = db.meta.objArrConvert(resArr[2]);
                        let multAns = db.meta.objArrConvert(resArr[3]);
                        for (let i = 0; i < final.analyzes.length; i++) final.analyzes[i].options = results[i];
                        for (let i = 0; i < final.anketa.choose.length; i++) final.anketa.choose[i].options = chooseAns[i];
                        for (let i = 0; i < final.anketa.chooseText.length; i++) final.anketa.chooseText[i].options = chTextAns[i];
                        for (let i = 0; i < final.anketa.multChoose.length; i++) final.anketa.multChoose[i].options = multAns[i];
                        meta.object.setProps(final, ['success'], [true]);
                        resolve(final);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

//getSelItems 
exports.getSelItems = function(params) {
    log.debug(`before: getSelItems: params = `);
    let { filter, groupId } = params;
    let suffix = modules.filter.getSuffix(filter);
    let query = `select m.main_id from main m where m.group_id = ${groupId}` + suffix;
    console.log(query);
    return Promise.resolve(db.query.paramOne(db.pool.anal, query));
}

//pushSelItems 
exports.pushSelItems = function(params) {
    log.debug(`before: pushSelItems: params = `);
    let { selId, ids } = params;
    let paramsArr = lib.meta.array.intoTwoArray(ids);
    paramsArr.forEach((el, ind, arr) => arr[ind].push(selId));
    let query = `update or insert into selection_link (main_id, sel_id) values(?, ?)`;
    return Promise.resolve(db.query.paramRepeatTr(params.tran, query, paramsArr));
}

//getSelInfo 
exports.getSelInfo = function(params) {
    log.debug(`before: getSelInfo: params = `);
    let { selId } = params;
    let queres = [`select count(*) from selection_link l join selection s on l.sel_id=s.sel_id where l.sel_id=${selId}`,
        `select count(*) from main m join selection s on s.group_id = m.group_id where s.sel_id=${selId}`
    ];
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//removeSelItems 
exports.removeSelItems = function(params) {
    log.debug(`before: removeSelItems: params = `);
    let { selId } = params;
    let query = `delete from selection_link where sel_id=${selId}`;
    return Promise.resolve(db.query.paramOneTr(params.tran, query));
}

//removeSel 
exports.removeSel = function(params) {
    log.debug(`before: removeSel: params = `);
    let { selId } = params;
    let query = `execute procedure remove_selection(${selId})`;
    return Promise.resolve(db.query.paramOneTr(params.tran, query));
}

//getStatisticsInfo
exports.getStatisticsInfo = function(params) {
    log.debug(`before: getStatisticsInfo: params = `);
    let { groupId, userId } = params;
    let final = { success: false, error: 'Ошибка на сервере' };
    let queres = [];
    queres.push(`select ag.anal_id id, name from analyzes_group ag join analyzes a on a.anal_id = ag.anal_id
        where group_id = ${groupId}`);
    queres.push(`select sel_id id, sel_name name from selection where group_id = ${groupId} and creator_id = ${userId}`);
    return new Promise((resolve, reject) => {
        db.query.many(db.query.paramMany(db.pool.anal, queres))
            .then((resArr) => {
                let analyzes = db.meta.objArrConvert(resArr[0]);
                let selections = db.meta.objArrConvert(resArr[1]);
                final = object.create(['analyzes', 'selections'], [analyzes, selections]);
                let analIds = meta.objArr.intoPropArrayList(analyzes, 'id');
                query = `select ao.res_id id, ar.result val from analyzes_options ao join analyzes_results
                     ar on ao.res_id = ar.res_id where ao.anal_id = ? and ao.res_id <> 0`;
                db.query.repeat(db.query.paramRepeat(db.pool.anal, query, analIds))
                    .then((resArr) => {
                        let results = db.meta.objArrConvert(resArr);
                        for (let i = 0; i < final.analyzes.length; i++) final.analyzes[i].options = results[i];
                        meta.object.setProps(final, ['success'], [true]);
                        resolve(final);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

//getStatCalcCols 
exports.getStatCalcCols = function(params) {
    log.debug(`before: getStatCalcCols: params = `);
    let { groupId, cols, selId } = params;
    let queres1 = [`select count(*) from main m join selection_link s on m.main_id = s.main_id
         where group_id = ${groupId} and sel_id = ${selId}`];
    let queres2 = modules.calc.cols(groupId, selId, cols);
    console.log(queres2);
    let queres = meta.array.merge(queres1, queres2);
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getStatCalcFilters 
exports.getStatCalcFilters = function(params) {
    log.debug(`before: getStatCalcFilters: params = `);
    let { groupId, filters, selId } = params;
    log.info('!!!!!!!!!!!!!!!!!');
    console.log(filters);
    console.log(modules.calc.filters(groupId, selId, filters));
    let queres = [
        `select count(*) from main m join selection_link s on m.main_id = s.main_id
         where group_id = ${groupId} and sel_id = ${selId}`,
        modules.calc.filters(groupId, selId, filters)
    ]
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getStatCalcAlleles 
exports.getStatCalcAlleles = function(params) {
    log.debug(`before: getStatCalcAlleles: params = `);
    let { groupId, cols, selId } = params;
    let queres1 = [`select count(*) from main m join selection_link s on m.main_id = s.main_id
         where group_id = ${groupId} and sel_id = ${selId}`];
    let queres2 = modules.calc.cols(groupId, selId, cols);
    console.log(queres2);
    let queres = meta.array.merge(queres1, queres2);
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getStatCalcXiSquere 
exports.getStatCalcXiSquere = function(params) {
    log.debug(`before: getStatCalcXiSquere: params = `);
    let { groupId, cols, selId1, selId2 } = params;
    let queryFuns = [];
    let queryParams = [];
    cols.forEach(col => {
        let queres = modules.calc.xiCols(groupId, selId1, selId2, col);
        console.log(queres);
        queryFuns.push(db.query.many);
        queryParams.push(db.query.paramMany(db.pool.anal, queres));
    });
    return Promise.resolve(db.query.paramUnion(queryFuns, queryParams));
}