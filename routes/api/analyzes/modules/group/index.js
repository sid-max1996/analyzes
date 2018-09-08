"use strict";
const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const db = back.db;
const log = back.log(module);
const check = lib.valid.check;

exports.checkGroupNotExist = (groupName) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal, `select group_id from groups where group_name = '${groupName}'`))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'группа с таким именем уже существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkGroupExist = (groupId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal, `select group_id from groups where group_id = ${groupId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('badReq'), 'группы с таким id не существует'));
            })
            .catch(err => reject(err));
    });
}

exports.checkIsCreator = (groupId, userId) => {
    return new Promise((resolve, reject) => {
        db.query.many(db.query.paramMany(db.pool.anal, [`select creator_id from groups where group_id = ${groupId} and creator_id=${userId}`,
                `select * from users where user_id=${userId} and role_id = 3`
            ]))
            .then(resArr => {
                let res1 = resArr[0];
                let res2 = resArr[1];
                if ((res1 && check.isArr(res1) && res1.length !== 0) ||
                    (res2 && check.isArr(res2) && res2.length !== 0))
                    resolve();
                else reject(new back.error.ShowError(back.error.code('accept'), 'только администратор и создатель группы имеет право на её удаление'));
            })
            .catch(err => reject(err));
    });
}

exports.checkIsGroupEmpty = (groupId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal,
                `select main_id from main where group_id = ${groupId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length === 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('accept'), 'невозможно удалить группу, в которой есть данные'));
            })
            .catch(err => reject(err));
    });
}

exports.checkIsGroupManager = (groupId, userId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal,
                `select u.user_id from group_users g join users u on g.user_id = u.user_id where g.group_id = ${groupId} and g.user_id=${userId} and u.role_id in (2, 3)`))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('accept'), 'только менеджер группы имеет право менять название'));
            })
            .catch(err => reject(err));
    });
}

exports.getIsGroupManager = (groupId, userId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal,
                `select u.user_id from group_users g join users u on g.user_id = u.user_id where g.group_id = ${groupId} and g.user_id=${userId} and u.role_id in (2, 3)`))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0) resolve(true);
                else resolve(false);
            })
            .catch(err => reject(err));
    });
}

exports.checkIsInGroup = (groupId, userId) => {
    return new Promise((resolve, reject) => {
        db.query.one(db.query.paramOne(db.pool.anal,
                `select u.user_id from group_users g join users u on g.user_id = u.user_id where g.group_id = ${groupId} and g.user_id=${userId}`))
            .then(res => {
                if (res && check.isArr(res) && res.length !== 0)
                    resolve();
                else reject(new back.error.ShowError(back.error.code('accept'), 'только менеджер группы имеет право менять название'));
            })
            .catch(err => reject(err));
    });
}

exports.checkIsRecordsCreator = (groupId, userId, idList) => {
    return new Promise((resolve, reject) => {
        exports.checkIsGroupManager(groupId, userId)
            .then(() => resolve())
            .catch(() => {
                db.query.repeat(db.query.paramRepeat(db.pool.anal,
                        `select creator_id ci, group_id gi from main where main_id = ?`, idList))
                    .then(resArr => {
                        for (let i = 0; i < resArr.length; i++) {
                            let res = resArr[i][0];
                            if (res.ci !== userId || res.gi !== groupId)
                                reject(new back.error.ShowError(back.error.code('accept'), 'сборщик может удалить только записи, которые он создал'));
                        }
                        resolve();
                    })
                    .catch(err => reject(err));
            });
    });
}

exports.checkIsRecordCreator = (mainId, userId) => {
    return new Promise((resolve, reject) => {
        let queres = [];
        queres.push(`select user_id, role_id from users where user_id = ${userId}`);
        queres.push(`select creator_id from main where main_id = ${mainId}`);
        db.query.many(db.query.paramMany(db.pool.anal, queres))
            .then(resArr => {
                let roleId = resArr[0][0].role_id;
                let userId = resArr[0][0].user_id;
                let creatId = resArr[1][0].creator_id;
                let isCan = roleId > 1 || creatId === userId;
                log.debug('isCan: ' + isCan);
                if (!isCan) reject(new back.error.ShowError(back.error.code('accept'),
                    'Изменение запрещено, не являетесь создателем записи'));
                else resolve();
            })
            .catch(err => reject(err));
    });
}