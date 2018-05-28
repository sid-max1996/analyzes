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

//getGroups 
exports.getGroups = function(params) {
    log.debug(`before: getGroups1: params = ${params}`);
    let queryFuns = [db.query.many, db.query.repeatMany];
    let queryParams = [];
    let paramFuns = [() => []];
    let { fetch, offset, filter, userId, groupId } = params;
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let filSuff = '';
    if (filter && check.notEmpty(filter.groupName)) filSuff = ` and g.group_name like '${filter.groupName}%'`;
    let suff = ` join group_users u on g.group_id=u.group_id where u.user_id = ${userId}`;
    let body = db.sql.queryBody(['g.group_id', 'g.group_name'], 'groups g');
    let queres1 = [prefix + body + suff + filSuff, `select count(*) from groups g` + suff + filSuff];
    queryParams.push(db.query.paramMany(db.pool.anal, queres1));
    let query1 = 'select user_name from group_users gu join users u on gu.user_id = u.user_id where group_id = ?';
    let query2 = 'select user_name from groups join users on user_id = creator_id where group_id = ?';
    paramFuns.push((resArr) => array.createByCount(objArr.intoArray(resArr[0], 'group_id'), 2));
    queryParams.push(db.query.paramRepeatMany(db.pool.anal, [query1, query2]));
    return Promise.resolve(db.query.paramNext(queryFuns, queryParams, paramFuns, ['paramsArr', 'paramsArrList']));
}

//getRecords 
exports.getRecords = function(params) {
    log.debug(`before: getRecords: params = `);
    console.log(params);
    let { fetch, offset, filter, groupId, userId, showAll } = params;
    let queryFuns = [db.query.many, db.query.repeatMany];
    let queryParams = [];
    let paramFuns = [() => []];
    let queres1 = [];
    let body = db.sql.queryBody(['m.main_id'], 'main m');
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let suffix = '';
    if (check.notNull(filter))
        suffix = modules.filter.getSuffix(filter);
    let groupSuff = check.notEmpty(suffix) ? ` and group_id= ${groupId}` : ` where group_id= ${groupId}`;
    if (!showAll && check.isEmpty(suffix)) suffix = ' where creator_id = ' + userId;
    else if (!showAll) suffix += ' and creator_id = ' + userId;
    queres1.push(`select count(*) from main m` + suffix + groupSuff);
    queres1.push(prefix + body + suffix + groupSuff + ' order by m.main_id asc');
    queryParams.push(db.query.paramMany(db.pool.anal, queres1));
    console.log(queryParams);
    let query1 = `select anal_id id, res_id op from analyzes_link where main_id = ?`;
    let query2 = `select ank_id id, ans_id op from anketa_link where main_id = ?`;
    let query3 = `select ank_id id, text_answer text from anketa_extra where main_id = ?`;
    let query4 = `select ank_id id, ans_id op from anketa_mult where main_id = ?`;
    let queres2 = [query1, query2, query3, query4];
    paramFuns.push((resArr) => array.createByCount(resArr[1] ? objArr.intoPropArrayList(resArr[1], 'main_id') : [], 4));
    queryParams.push(db.query.paramRepeatMany(db.pool.anal, queres2));
    return Promise.resolve(db.query.paramNext(queryFuns, queryParams, paramFuns, ['paramsArr', 'paramsArrList']));
}

//addGroup 
exports.addGroup = function(params) {
    log.debug('before: addGroup:');
    console.log(params);
    let { tran, groupName, userId, membersIds, analIds, ankIds } = params;
    let queryFuns = [db.query.oneTr, db.query.repeatTr, db.query.repeatTr, db.query.repeatTr];
    let queryParams = [];
    let paramFuns = [() => [groupName, userId]];
    queryParams.push(db.query.paramOneTr(tran,
        `insert into groups (group_name, creator_id) values(?, ?) returning group_id`));
    paramFuns.push((res, prevRet) => {
        prevRet.groupId = res.group_id;
        let paramsArr = [array.clone([res.group_id, userId])];
        membersIds.forEach(id => paramsArr.push([res.group_id, id]));
        return paramsArr;
    });
    queryParams.push(db.query.paramRepeatTr(tran,
        'insert into group_users (group_id, user_id) values(?, ?)'));
    paramFuns.push((res, prevRet) => {
        let paramsArr = [];
        analIds.forEach(id => paramsArr.push([prevRet.groupId, id]));
        return paramsArr;
    });
    queryParams.push(db.query.paramRepeatTr(tran,
        'insert into analyzes_group (group_id, anal_id) values(?, ?)'));
    paramFuns.push((res, prevRet) => {
        let paramsArr = [];
        ankIds.forEach(id => paramsArr.push([prevRet.groupId, id]));
        return paramsArr;
    });
    queryParams.push(db.query.paramRepeatTr(tran,
        'insert into anketa_group (group_id, ank_id) values(?, ?)'));
    return Promise.resolve(db.query.paramNext(queryFuns, queryParams, paramFuns, ['params', 'paramsArr', 'paramsArr', 'paramsArr']));
}

//getAddGroupParams 
exports.getAddGroupParams = function(params) {
    log.debug(`before: getGroupSettings: params = ${params}`);
    let { fetch, offset, filter, userId } = params;
    let prefix = db.sql.selectPrefix({ first: fetch, skip: offset });
    let body1 = db.sql.queryBody(['user_id', 'user_name'], 'users');
    let body2 = db.sql.queryBody(['user_id', 'user_name'], 'users');
    let queres = [`select count(*) from users where role_id=1`, prefix + body1 + ' where role_id=1 order by user_id',
        `select count(*) from users where role_id in (2, 3) and user_id != ${userId}`,
        prefix + body2 + ` where role_id in (2, 3) and user_id != ${userId} order by user_id`
    ];
    queres.push('select count(*) from analyzes');
    queres.push(prefix + 'anal_id, name from analyzes');
    queres.push('select count(*) from  anketa');
    queres.push(prefix + 'ank_id, question from anketa');
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getGroupCols
exports.getGroupCols = function(params) {
    log.debug(`before: getGroupCols: params = `);
    console.log(params);
    let final = { success: false, error: 'Ошибка на сервере' };
    let { groupId } = params;
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

//updateRecord 
exports.updateRecord = function(params) {
    log.debug(`before: updateRecord: params = `);
    console.log(params);
    let { newRow, id, tran } = params;
    let queres = modules.update.getQueres(id, newRow);
    let pools = array.createByCount(db.pool.anal, queres.length);
    let paramsArr = array.createByCount([], queres.length);
    return Promise.resolve(db.query.paramManyTr(tran, queres, paramsArr));
}

//addRecords 
exports.addRecords = function(params) {
    log.debug(`before: addRecords: params = `);
    console.log(params);
    let { tran, userId, groupId, rows } = params;
    let queryFuns = [db.query.repeat, db.query.repeatTr];
    let queryParams = [];
    let paramFuns = [() => [groupName, userId]];
    let query = 'insert into main (group_id, creator_id) values(?, ?) returning main_id';
    let paramsArr = array.createByCount([groupId, userId], rows.length);
    return new Promise((resolve, reject) => {
        db.query.repeat(db.query.paramRepeat(db.pool.anal, query, paramsArr))
            .then((res) => {
                console.log('into');
                let mainIds = [];
                res.forEach(obj => mainIds.push(obj.main_id));
                let queres = modules.save.getQueres(mainIds, rows);
                return resolve(db.query.paramManyTr(tran, queres));
            })
            .catch(err => reject(err));
    });
}

//removeRecords 
exports.removeRecords = function(params) {
    log.debug(`before: removeRecords: params = `);
    console.log(params);
    let { idList, tran } = params;
    console.log('idList ' + idList);
    let query = 'execute procedure remove_main(?)';
    return Promise.resolve(db.query.paramRepeatTr(tran, query, idList));
}

//getGroupSettings 
exports.getGroupSettings = function(params) {
    log.debug(`before: getGroupInfo1: params = `);
    console.log(params);
    let { groupId, userId } = params;
    let queres = [];
    queres.push(`select creator_id from groups where group_id = ${groupId} and creator_id=${userId}`);
    queres.push(`select u.user_id from group_users gu join users u on gu.user_id = u.user_id 
        where gu.group_id = ${groupId} and u.user_id=${userId} and u.role_id in (2, 3)`);
    queres.push(`select gu.user_id, u.user_name from group_users gu join users u on gu.user_id = u.user_id
        where gu.group_id = ${groupId} and u.role_id = 1`);
    queres.push(`select gu.user_id, u.user_name from group_users gu join users u on gu.user_id = u.user_id
        where gu.group_id = ${groupId} and u.role_id in (2, 3)`);
    queres.push(`select a.anal_id, a.name from analyzes_group ag join analyzes a on ag.anal_id = a.anal_id
        where ag.group_id = ${groupId}`);
    queres.push(`select a.ank_id, a.question from anketa_group ag join anketa a on ag.ank_id = a.ank_id
        where ag.group_id = ${groupId}`);
    queres.push(`select group_name from groups where group_id = ${groupId}`);
    queres.push(`select u.user_id from group_users gu join users u on gu.user_id = u.user_id 
        where gu.group_id = ${groupId} and u.user_id=${userId} and u.role_id=3`);
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//removeGroup
exports.removeGroup = function(params) {
    log.debug(`before: removeGroup: params = `);
    return Promise.resolve(db.query.paramOneTr(params.tran, 'execute procedure remove_group(?)', [params.groupId]));
}

//changeGroupName 
exports.changeGroupName = function(params) {
    log.debug(`before: changeGroupName: params = `);
    let { groupName, groupId, tran } = params;
    let query = `update groups set group_name = '${groupName}' where group_id = ${groupId}`;
    return Promise.resolve(db.query.paramOneTr(tran, query));
}

//removeGroupMember
exports.removeGroupMember = function(params) {
    log.debug(`before: removeGroupMember: params = `);
    let query = 'execute procedure remove_group_member(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.userId]));
}

//addGroupMember 
exports.addGroupMember = function(params) {
    log.debug(`before: addGroupMember: params = `);
    let query = 'execute procedure add_group_member(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.userId]));
}

//removeGroupAnalyze
exports.removeGroupAnalyze = function(params) {
    log.debug(`before: removeGroupAnalyze: params = `);
    let query = 'execute procedure remove_group_analyze(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.analId]));
}

//addGroupAnalyze 
exports.addGroupAnalyze = function(params) {
    log.debug(`before: addGroupAnalyze: params = `);
    let query = 'execute procedure add_group_analyze(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.analId]));
}

//removeGroupAnketa 
exports.removeGroupAnketa = function(params) {
    log.debug(`before: removeGroupAnketa: params = `);
    let query = 'execute procedure remove_group_anketa(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.ankId]));
}

//addGroupAnketa 
exports.addGroupAnketa = function(params) {
    log.debug(`before: addGroupAnketa: params = `);
    let query = 'execute procedure add_group_anketa(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.userOp, params.groupId, params.ankId]));
}

//getColsData 
exports.getColsData = function(params) {
    log.debug(`before: getColsData: params = `);
    let queres = [];
    queres.push(`select res_id, result from analyzes_results where res_id != 0`);
    queres.push(`select ans_id, answer from anketa_answers where ans_id != 0`);
    queres.push(`select anal_id, name from analyzes`);
    queres.push(`select ank_id, question from anketa`);
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//getColInfo 
exports.getColInfo = function(params) {
    log.debug(`before: getColInfo: params = `);
    let { id, type } = params;
    let queres = [];
    if (type === 'analyze') {
        queres.push(`select name name from analyzes where anal_id=${id}`);
        queres.push(`select r.res_id id, r.result name from analyzes a join analyzes_options o on a.anal_id = o.anal_id
         join analyzes_results r on r.res_id = o.res_id where a.anal_id=${id} and r.res_id != 0`);
        queres.push(`select r.res_id id, r.result name from analyzes_results r where r.res_id != 0`);
    }
    if (type === 'anketa') {
        queres.push(`select question name, is_choose choose, is_mult mult from anketa where ank_id=${id}`);
        queres.push(`select aa.ans_id id, aa.answer name from anketa a join anketa_options o on a.ank_id = o.ank_id
         join anketa_answers aa on aa.ans_id = o.ans_id where a.ank_id=${id} and aa.ans_id != 0`);
        queres.push(`select aa.ans_id id, aa.answer name from anketa_answers aa  where aa.ans_id != 0`);
    }
    return Promise.resolve(db.query.paramMany(db.pool.anal, queres));
}

//addColumn 
exports.addColumn = function(args) {
    log.debug(`before: addColumn: params = `);
    let { name, type, params } = args;
    let query = `execute procedure add_column(?, ?, ?)`;
    return Promise.resolve(db.query.paramOneTr(args.tran, query, [type, name, params]));
}

//removeColumn
exports.removeColumn = function(params) {
    log.debug(`before: removeColumn: params = `);
    let query = 'execute procedure remove_column(?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.type, params.id]));
}

//addOption 
exports.addOption = function(params) {
    log.debug(`before: addOption: params = `);
    let { name, type } = params;
    let query = null;
    if (type === 'analyze') query = `insert into analyzes_results (result) values('${name}')`;
    if (type === 'anketa') query = `insert into anketa_answers (answer) values('${name}')`;
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.type, params.id]));
}

//removeOption 
exports.removeOption = function(params) {
    log.debug(`before: removeOption: params = `);
    let query = 'execute procedure remove_option(?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.type, params.id]));
}

//addColOption 
exports.addColOption = function(params) {
    log.debug(`before: addColOption: params = `);
    let { id, opId, type } = params;
    let query = null;
    if (type === 'analyze') query = `insert into analyzes_options (anal_id, res_id) values(${id}, ${opId})`;
    if (type === 'anketa') query = `insert into anketa_options (ank_id, ans_id) values(${id}, ${opId})`;
    return Promise.resolve(db.query.paramOneTr(params.tran, query));
}

//removeOption 
exports.removeColOption = function(params) {
    log.debug(`before: removeColOption: params = `);
    let query = 'execute procedure remove_column_option(?, ?, ?)';
    return Promise.resolve(db.query.paramOneTr(params.tran, query, [params.type, params.id, params.opId]));
}