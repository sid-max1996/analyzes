"use strict";
const lib = require('../../../../../core/lib');
const check = lib.valid.check;

exports.cols = function(groupId, selId, cols) {
    let res = [];
    if (check.isArr(cols))
        cols.forEach(col => {
            if (col.options)
                col.options.forEach(op => {
                    res.push(`select count(*), (select name from analyzes where anal_id=${col.id}), 
                (select result as res from analyzes_results where res_id=${op.id})
                from main m join selection_link s on m.main_id = s.main_id 
                join analyzes_link al on s.main_id=al.main_id
                where m.group_id = ${groupId} and sel_id = ${selId}
                and al.anal_id=${col.id} and al.res_id=${op.id}`);
                });
        });
    return res;
}

exports.xiCols = function(groupId, selId1, selId2, col) {
    let res = [];
    res.push(`select name from analyzes where anal_id=${col.id}`);
    if (col.options)
        col.options.forEach(op => {
            res.push(`select count(*) from main m join selection_link s on m.main_id = s.main_id 
                join analyzes_link al on s.main_id=al.main_id
                where m.group_id = ${groupId} and sel_id = ${selId1}
                and al.anal_id=${col.id} and al.res_id=${op.id}`);
            res.push(`select count(*) from main m join selection_link s on m.main_id = s.main_id 
                join analyzes_link al on s.main_id=al.main_id
                where m.group_id = ${groupId} and sel_id = ${selId2}
                and al.anal_id=${col.id} and al.res_id=${op.id}`);
        });
    return res;
}

exports.filters = function(groupId, selId, filters) {
    let res = `select count(*) from main m join selection_link s on m.main_id = s.main_id
    where group_id = ${groupId} and sel_id = ${selId}`;
    if (filters.length > 0) res += ' and ((' + getSuffix(filters[0]) + ')';
    for (let i = 1; i < filters.length; i++) {
        res += ' or (' + getSuffix(filters[i]) + ')';
    }
    if (filters.length > 0) res += ')';
    return res;
}

const analTemplate = (analId, resId) => {
    return ` 
    (select res_id from analyzes_link where main_id = m.main_id and anal_id=${analId}) = ${resId}`;
}

const ankTemplateOp = (ankId, ansId) => {
    return ` 
    (select ans_id from anketa_link where main_id = m.main_id and ank_id=${ankId}) = ${ansId}`;
}

const ankTemplateText = (ankId, text) => {
    return ` 
    (select text_answer from anketa_extra where main_id = m.main_id and ank_id=${ankId}) like '%${text}%'`;
}

const ankTemplateMult = (ankId, ops) => {
    let res = ` 
    ${ops[0]} = some(select ans_id from anketa_mult where main_id = m.main_id and ank_id=${ankId})`;
    for (let i = 1; i < ops.length; i++)
        res = res + ` and ${ops[i]} = some(select ans_id from anketa_mult where main_id = m.main_id and ank_id=${ankId})`;
    return res;
}

let getSuffix = function(filter) {
    console.log('getSuffix');
    let res = '';
    for (let key in filter) {
        let val = filter[key];
        if (key.indexOf('anal') !== -1) {
            let analId = Number(key.replace('anal-', ''));
            let resId = Number(val.op);
            if (!isNaN(resId) && val.op.length !== 0) {
                if (res === '') res = ' ' + analTemplate(analId, resId);
                else res += ' and' + analTemplate(analId, resId);
            }
        } else if (key.indexOf('ank') !== -1) {
            let ankId = Number(key.replace('ank-', ''));
            let ansId = Number(val.op);
            let text = val.text;
            let ops = val.ops;
            if (!isNaN(ansId) && val.op.length !== 0) {
                if (res === '') res = ' ' + ankTemplateOp(ankId, ansId);
                else res += ' and' + ankTemplateOp(ankId, ansId);
            }
            if (check.notEmpty(text)) {
                if (res === '') res = ' ' + ankTemplateText(ankId, text);
                else res += ' and' + ankTemplateText(ankId, text);
            }
            if (check.isArr(ops) && ops.length > 0) {
                if (res === '') res = ' ' + ankTemplateMult(ankId, ops);
                else res += ' and' + ankTemplateMult(ankId, ops);
            }
        }
    }
    return res;
}