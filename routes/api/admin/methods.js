const helper = require(appRoot + '/modules/helper');
const log = require(appRoot + '/modules/log')(module);
const protect = require(appRoot + "/modules/protect.js");
const db = require(appRoot + '/modules/db');

//getUsers section
exports.setUsersParams = function({ fetch, offset, filter }) {
    log.debug(`setUsersParams: fetch = ${fetch}, offset = ${offset}`);
    let prefix = db.getSelectPrefix({ first: fetch, skip: offset });
    let suffix = '';
    if (!helper.isEmptyOrNull(filter)) {
        let { userId, roleId, userName, email } = filter;
        log.debug(`userId = ${userId} roleId = ${roleId} userName = ${userName} email = ${email}`);
        suffix = db.getWhereSuffix({
            values: ['user_id', 'role_id', 'user_name', 'user_email'],
            compares: [userId, roleId, userName, email],
            types: ['eq', 'eq', 'like', 'like']
        });
    }
    log.debug(suffix);
    return Promise.resolve({
        queres: [
            prefix + `user_id, role_id, user_name, user_email from users` + suffix,
            `select count(*) from users` + suffix
        ],
        paramsArr: [
            [],
            []
        ]
    });
}

exports.getUsersData = (resArr) => {
    log.debug(`getUsersData: resArr = ${resArr}`);
    console.log(resArr);
    return new Promise((resolve, reject) => {
        let usersInfo = [];
        resArr[0].forEach((item) => {
            let userObj = {
                userId: item.user_id,
                roleId: item.role_id,
                userName: helper.trimOrNull(item.user_name),
                email: helper.trimOrNull(item.user_email)
            };
            usersInfo.push(userObj);
        });
        resolve({ count: resArr[1][0].count, data: usersInfo });
    });
}

//add user sections
exports.setAddUserParams = function({ userName, roleId, password, email }) {
    log.debug(`setAddUserParams: userName = ${userName}, roleId = ${roleId}, password = ${password}, email = ${email}`);
    return new Promise((resolve, reject) => {
        protect.getHashPassAndSalt(password)
            .then(({ hashPass, salt }) => {
                resolve({
                    query: `execute procedure add_user(?, ?, ?, ?, ?)`,
                    params: [userName, roleId, email, hashPass, salt]
                });
            })
            .catch((err) => reject());
    });
}

exports.getAddUserData = (result) => {
    log.debug(`getAddUsersData: result error = ${result.error}`);
    return new Promise((resolve, reject) => {
        let error = result.error;
        let isSuccess = error.length == 0 ? true : false;
        let answerObj = { success: isSuccess };
        if (!isSuccess)
            answerObj.error = error;
        resolve(answerObj);
    });
}

//update user sections
exports.setUpdateUserParams = function({ userId, roleId, userName, email }) {
    log.debug(`setUpdateUserParams: userName = ${userName}, roleId = ${roleId}, userId = ${userId}, email = ${email}`);
    return Promise.resolve({
        query: `execute procedure update_user(?, ?, ?, ?)`,
        params: [userId, roleId, userName, email]
    });
}

exports.getUpdateUserData = (result) => {
    log.debug(`getUpdateUsersData: result error = ${result.error}`);
    return new Promise((resolve, reject) => {
        let error = result.error;
        let isSuccess = error.length == 0 ? true : false;
        let answerObj = { success: isSuccess };
        if (!isSuccess)
            answerObj.error = error;
        resolve(answerObj);
    });
}

//remove users section
exports.setRemoveUsersParams = function({ idList }) {
    log.debug(`setRemoveUsersParams:`);
    console.log(idList);
    return Promise.resolve({
        query: `execute procedure remove_user(?)`,
        paramsArr: idList,
        count: idList.length
    });
}

exports.getRemoveUsersData = (results) => {
    log.debug(`getRemoveUsersData: results`);
    console.log(results);
    return new Promise((resolve, reject) => {
        let allErrors = '';
        results.forEach(result => {
            log.info(result);
            allErrors += result.error;
        });
        log.info(1);
        let isSuccess = allErrors.length == 0 ? true : false;
        let answerObj = { success: isSuccess };
        if (!isSuccess) answerObj.error = allErrors;
        log.info(2);
        resolve(answerObj);
    });
}