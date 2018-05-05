const log = require(appRoot + '/modules/log')(module);
const helper = require(appRoot + '/modules/helper');
const methods = require('./methods');
const db = require(appRoot + '/modules/db');
const validation = require(appRoot + '/modules/validation');
const Validator = validation.Validator;

exports.getUsers = function(req, res, next) {
    let { sessionId, fetch, offset, filter } = req.body;
    validator = new Validator();
    let values = [fetch, offset];
    let validFunArr = [validation.checkFetch, validation.checkOffset];
    let errors = ['неверный fetch', 'неверный offset'];
    validator.doValidationMany(values, validFunArr, errors);
    if (validator.isHasError)
        res.json({ success: false, error: validator.errorText });
    log.debug(`getUsers: fetch = ${fetch}, offset = ${offset}`);
    helper.checkAccess(sessionId, true, 'adminAction')
        .catch((err) => res.json({ success: false, error: 'не достаточно прав' }))
        .then(() => Promise.resolve({ fetch: fetch, offset: offset, filter: filter }))
        .then(methods.setUsersParams)
        .then(db.doUserQueres)
        .then(methods.getUsersData)
        .then((usersData) => {
            res.json(usersData);
        })
        .catch((err) => res.json({
            success: false,
            error: 'ошибка запроса к бд'
        }));
}

exports.addUser = function(req, res, next) {
    let { sessionId, userName, roleId, password, email } = req.body;
    roleId = Number(roleId);
    validator = new Validator();
    let values = [userName, roleId, password, email];
    let validFunArr = [validation.checkEmptyOrNull, validation.checkRoleId, validation.checkPassword, validation.checkEmail];
    let errors = ['неверное имя пользователя', 'неверная роль', 'неверный пароль', 'неверная почта'];
    validator.doValidationMany(values, validFunArr, errors);
    if (validator.isHasError)
        res.json({ success: false, error: validator.errorText });
    else {
        log.debug(`addUser: userName = ${userName}, roleId = ${roleId}, password = ${password}, email = ${email}`);
        helper.checkAccess(sessionId, true, 'adminAction')
            .catch((err) => res.json({ success: false, error: 'не достаточно прав' }))
            .then(() => Promise.resolve({ userName: userName, roleId: roleId, password: password, email: email }))
            .then(methods.setAddUserParams)
            .then(db.doUserQuery)
            .then(methods.getAddUserData)
            .then((answer) => {
                res.json(answer);
            })
            .catch((err) => {
                log.error(err);
                res.json({
                    success: false,
                    error: 'ошибка запроса к бд'
                })
            });
    }
}

exports.updateUser = function(req, res, next) {
    let { sessionId, userId, roleId, userName, email } = req.body;
    userId = Number(userId);
    roleId = Number(roleId);
    if (!Validator.doValidation(email, validation.checkEmail))
        res.json({ success: false, error: 'неверная почта' });
    else {
        log.debug(`updateUser: userId = ${userId}, roleId = ${roleId}, userName = ${userName}, email = ${email}`);
        helper.checkAccess(sessionId, true, 'adminAction')
            .catch((err) => res.json({ success: false, error: 'не достаточно прав' }))
            .then(() => Promise.resolve({ userId: userId, roleId: roleId, userName: userName, email: email }))
            .then(methods.setUpdateUserParams)
            .then(db.doUserQuery)
            .then(methods.getUpdateUserData)
            .then((answer) => {
                res.json(answer);
            })
            .catch((err) => res.json({
                success: false,
                error: 'ошибка запроса к бд'
            }));
    }
}

exports.removeUsers = function(req, res, next) {
    let { sessionId, idList } = req.body;
    if (!Validator.doValidation(idList, validation.checkArray))
        res.json({ success: false, error: 'idList не массив' });
    else {
        log.debug(`removeUsers:`);
        console.log(idList);
        helper.checkAccess(sessionId, true, 'adminAction')
            .catch((err) => res.json({ success: false, error: 'не достаточно прав' }))
            .then(() => Promise.resolve({ idList: idList }))
            .then(methods.setRemoveUsersParams)
            .then(db.doManyUserQuery)
            .then(methods.getRemoveUsersData)
            .then((answer) => {
                res.json(answer);
            })
            .catch((err) => res.json({ success: false, error: 'ошибка запроса к бд' }));
    }
}