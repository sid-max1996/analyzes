"use strict";
const lib = require('../../../../../core/lib');
const check = lib.valid.check;

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

module.exports.getSuffix = function(filter) {
    console.log('getSuffix');
    console.log(filter);
    let res = '';
    for (let key in filter) {
        let val = filter[key];
        if (key.indexOf('anal') !== -1) {
            let analId = Number(key.replace('anal-', ''));
            let resId = Number(val.op);
            if (!isNaN(resId) && val.op.length !== 0) {
                if (res === '') res = ' where' + analTemplate(analId, resId);
                else res += ' and' + analTemplate(analId, resId);
            }
        } else if (key.indexOf('ank') !== -1) {
            let ankId = Number(key.replace('ank-', ''));
            let ansId = Number(val.op);
            let text = val.text;
            let ops = val.ops;
            if (!isNaN(ansId) && val.op.length !== 0) {
                if (res === '') res = ' where' + ankTemplateOp(ankId, ansId);
                else res += ' and' + ankTemplateOp(ankId, ansId);
            }
            if (check.notEmpty(text)) {
                if (res === '') res = ' where' + ankTemplateText(ankId, text);
                else res += ' and' + ankTemplateText(ankId, text);
            }
            if (check.isArr(ops) && ops.length > 0) {
                if (res === '') res = ' where' + ankTemplateMult(ankId, ops);
                else res += ' and' + ankTemplateMult(ankId, ops);
            }
        }
        console.log(res);
    }
    return res;
}