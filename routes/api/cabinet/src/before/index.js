const back = require('../../../../../core/back');
const lib = require('../../../../../core/lib');
const log = back.log(module);
const db = back.db;
const crypto = back.protect.crypto;
const object = lib.meta.object;
const array = lib.meta.array;
const check = lib.valid.check;

exports.getCabinet = function(userId) {
    log.debug(`before: getCabinet: userId = ${userId}`);
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'execute procedure get_user_info(?)', [userId]));
}

exports.getAnketa = function(userId) {
    log.debug(`before: getAnketa: userId = ${userId}`);
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'execute procedure get_user_anketa(?)', [userId]));
}

exports.saveAnketa = function(params) {
    log.debug(`before: saveAnketa: params = ${params}`);
    let { userId, firstName, secondName, phone, city, workPlace, aboutYourself } = params;
    params = [userId, firstName, secondName, phone, city, workPlace, aboutYourself];
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'execute procedure update_user_anketa(?,?,?,?,?,?,?)', params));
}

exports.getSettings = function(userId) {
    log.debug(`before: getSettings: userId = ${userId}`);
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'execute procedure get_user_settings(?)', [userId]));
}

const saveSettingsPassword = function(password, params) {
    log.debug(`saveSettingsPassword: params: `);
    console.log(params);
    return new Promise((resolve, reject) => {
        if (check.notNull(password)) {
            crypto.getHashPassAndSalt(password)
                .then((protData) => resolve(array.pushObjProps(params, protData, ['hashPass', 'salt'])))
                .catch((err) => reject(err));
        } else resolve(array.merge(params, [null, null]));
    });
}

exports.saveSettings = function(params) {
    log.debug(`before: saveSettings: params = ${params}`);
    let { userId, email, password, photoUrl } = params;
    let queryArgs = [userId, email];
    return new Promise((resolve, reject) => {
        saveSettingsPassword(password, queryArgs)
            .then((params) => {
                if (check.notNull(photoUrl))
                    return Promise.resolve(array.pushAndReturn(params, photoUrl));
                else return Promise.resolve(array.pushAndReturn(params, null));
            })
            .then((params) => resolve(
                db.query.paramOne(db.pool.anal, `execute procedure update_user_settings(?, ?, ?, ?, ?)`, params)))
            .catch((err) => reject(err));
    });
}