const lib = require('../../../../../core/lib');
const check = lib.valid.check;

const analTemplate = (mainId, analId, resId) => {
    return `update or insert into analyzes_link (main_id, anal_id, res_id) values(${mainId}, ${analId}, ${resId})`;
}

const ankTemplateOp = (mainId, ankId, ansId) => {
    return `update or insert into anketa_link (main_id, ank_id, ans_id) values(${mainId}, ${ankId}, ${ansId})`;
}

const ankTemplateText = (mainId, ankId, text) => {
    return `update or insert into anketa_extra (main_id, ank_id, text_answer) values(${mainId}, ${ankId}, '${text}')`;
}

const ankTemplateMult = (mainId, ankId, ops) => {
    let res = [`delete from anketa_mult where main_id=${mainId} and ank_id=${ankId}`];
    for (let i = 0; i < ops.length; i++)
        res.push(`insert into anketa_mult (main_id, ank_id, ans_id) values(${mainId}, ${ankId}, ${ops[i]})`);
    return res;
}

module.exports.getQueres = function(mainId, newRow) {
    console.log('getQueres');
    console.log(newRow);
    let res = [];
    for (let key in newRow) {
        let val = newRow[key];
        if (key.indexOf('anal') !== -1) {
            let analId = Number(key.replace('anal-', ''));
            let resId = Number(val.op);
            if (!isNaN(resId) && val.op.length !== 0)
                res.push(analTemplate(mainId, analId, resId));
        } else if (key.indexOf('ank') !== -1) {
            let ankId = Number(key.replace('ank-', ''));
            let ansId = Number(val.op);
            let text = val.text;
            let ops = val.ops;
            if (!isNaN(ansId) && val.op.length !== 0)
                res.push(ankTemplateOp(mainId, ankId, ansId));
            if (check.notEmpty(text))
                res.push(ankTemplateText(mainId, ankId, text));
            if (check.isArr(ops))
                ankTemplateMult(mainId, ankId, ops).forEach(el => res.push(el));
        }
        console.log(res);
    }
    return res;
}