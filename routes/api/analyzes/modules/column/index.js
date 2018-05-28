const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const db = back.db;
const log = back.log(module);
const check = lib.valid.check;


exports.checkType = (type) => {
    return new Promise((resolve, reject) => {
        if (type === 'analyze' || type === 'anketa') resolve();
        else reject(new back.error.ShowError(back.error.code('badReq'), 'type: analyze or anketa'));
    });
}

exports.checkColNotExist = ({ name, type }) => {
    return new Promise((resolve, reject) => {
        let query = '';
        if (type === 'analyze') query = `select anal_id from analyzes where name = '${name}'`;
        if (type === 'anketa') query = `select ank_id from anketa where question = '${name}'`;
        db.query.one(db.query.paramOne(db.pool.anal, query))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'столбец с таким именем уже существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkColExist = ({ id, type }) => {
    return new Promise((resolve, reject) => {
        let query = '';
        if (type === 'analyze') query = `select anal_id from analyzes where anal_id = ${id}`;
        if (type === 'anketa') query = `select ank_id from anketa where ank_id = ${id}`;
        db.query.one(db.query.paramOne(db.pool.anal, query))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'столбеца с таким id не существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkOpNotExist = ({ name, type }) => {
    return new Promise((resolve, reject) => {
        let query = '';
        if (type === 'analyze') query = `select res_id from analyzes_results where result = '${name}'`;
        if (type === 'anketa') query = `select ans_id from anketa_answers where answer = '${name}'`;
        db.query.one(db.query.paramOne(db.pool.anal, query))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'опция с таким именем уже существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkOpExist = ({ id, type }) => {
    return new Promise((resolve, reject) => {
        let query = '';
        if (type === 'analyze') query = `select res_id from analyzes_results where res_id = ${id}`;
        if (type === 'anketa') query = `select ans_id from anketa_answers where ans_id = ${id}`;
        db.query.one(db.query.paramOne(db.pool.anal, query))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'опция с таким id не существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkColNotHasOp = ({ id, opId, type }) => {
    return new Promise((resolve, reject) => {
        let query = '';
        if (type === 'analyze') query = `select * from analyzes_options where res_id = ${opId} and anal_id = ${id}`;
        if (type === 'anketa') query = `select * from anketa_options where ans_id = ${opId} and ank_id = ${id}`;
        db.query.one(db.query.paramOne(db.pool.anal, query))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'опция уже привязана к столбцу'));
            })
            .catch(err => reject(err));
    });
}