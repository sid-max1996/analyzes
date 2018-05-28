const back = require('../../../../../core/back');
const log = back.log(module);
const db = back.db;

exports.getRoleId = function(userId) {
    log.debug(`before: getRoleId: userId = ${userId}`);
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'select role_id from users where user_id = ?', [userId]));
}

exports.getRoleInfo = function() {
    log.debug(`before: getRoleInfo: `);
    return Promise.resolve(db.query.paramOne(db.pool.anal, 'select role_id, role_name from roles', []));
}