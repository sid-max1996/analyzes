const db = require('../db');
const query = db.query;
const pool = db.pool;
const session = require('../session');
const log = require('../log')(module);
const check = require('../../../lib').valid.check;
const object = require('../../../lib/').meta.object;
const error = require('../error');
const ShowError = error.ShowError;
const HideError = error.HideError;

const sessionAccess = function({ user, isAccess, isReset }) {
    log.debug('sessionAccess access');
    return new Promise((resolve, reject) => {
        if ((!isAccess && user.isAuthorize) || (user.isAuthorize && user.isAccess)) {
            if (isReset) user.isAccess = false;
            let userId = user.id;
            session.updateUser(user)
                .then((user) => resolve(userId))
                .catch((err) => reject(err));
        } else {
            if (!user.isAuthorize) reject(new ShowError('accept', `не авторизован`));
            else if (!user.isAccess) reject(new ShowError('accept', `не запрашивал доступ`));
            else reject(new HideError(`sessionAccess function fatal error`));
        }
    });
}

const userRoleId = function(userId) {
    log.debug('userRoleId access');
    return new Promise((resolve, reject) => {
        query.one(query.paramOne(pool.anal, `select role_id from users where user_id = ?`, [userId]))
            .then(result => {
                if (check.isNull(result[0].role_id))
                    reject(new HideError('Ошибка установления роли пользователя'));
                else resolve(result[0].role_id);
            })
            .catch((err) => reject(err));
    });
}

const checkAction = function({ roleId, action }) {
    log.debug('checkAction access');
    return new Promise((resolve, reject) => {
        query.one(query.paramOne(pool.anal, `execute procedure get_roleId_forAction(?)`, [action]))
            .then(result => {
                if (check.isNull(result.role_id))
                    reject(new HideError('Ошибка установления роли действия'));
                let isAccess = roleId >= result.role_id;
                resolve(isAccess);
            })
            .catch((err) => reject(err));
    });
}

exports.check = function(sessionId, isAccess, isReset, action = 'simple') {
    log.debug('check access');
    return new Promise((resolve, reject) => {
        session.getUserById(sessionId)
            .then((user) => Promise.resolve({ user: user, isAccess: isAccess, isReset: isReset }))
            .then(sessionAccess)
            .then(userRoleId)
            .then(roleId => Promise.resolve(object.create(['roleId', 'action'], [roleId, action])))
            .then(checkAction)
            .then(isAccess => {
                if (isAccess) resolve(sessionId);
                else reject(new ShowError(error.code('accept'), 'Не достаточно прав'));
            })
            .catch(err => reject(err));
    });
}