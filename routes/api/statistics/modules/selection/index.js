const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const db = back.db;
const log = back.log(module);
const check = lib.valid.check;

exports.checkSelNotExist = ({ selName, userId }) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal, `select sel_id from selection where sel_name = '${selName}'
        and creator_id=${userId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'выборка с таким именем уже существует'));
            })
            .catch(err => reject(err));
    });
}

exports.getGroupId = (selId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal, `select group_id from selection where sel_id = ${selId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length === 1)
                    resolve(res[0].group_id);
                else reject(new back.error.HideError('getGroupId error'));
            })
            .catch(err => reject(err));
    });
}

exports.checkIdsGroup = (groupId, ids) => {
    return new Promise((resolve, reject) => {
        let idList = lib.meta.array.intoTwoArray(ids);
        db.query.repeat(db.query.paramRepeat(db.pool.anal,
                `select group_id gi from main where main_id = ?`, idList))
            .then(resArr => {
                for (let i = 0; i < resArr.length; i++) {
                    let res = resArr[i][0];
                    if (res.gi !== groupId)
                        reject(new back.error.ShowError(back.error.code('accept'), 'невозможно добавить запись из другой группы'));
                }
                resolve();
            })
            .catch(err => reject(err));
    });
}

exports.checkSelExist = (selId, userId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal, `select sel_id from selection where sel_id = ${selId} 
            and creator_id=${userId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length === 1)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'такой выборки не существует'));
            })
            .catch(err => reject(err));
    });
}