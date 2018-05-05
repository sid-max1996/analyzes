const helper = require(appRoot + '/modules/helper');
const log = require(appRoot + '/modules/log')(module);

//getRoleId section
exports.setRoleIdParams = function(userId) {
    log.debug(`setRoleIdParams: userId = ${userId}`);
    return Promise.resolve({
        query: 'select role_id from users where user_id = ?',
        params: [userId]
    });
}

exports.getRoleIdData = (result) => {
    log.debug(`getRoleIdData: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        let roleData = {
            roleId: result[0].role_id
        };
        resolve(roleData);
    });
}

//getRoleInfo section
exports.setRoleInfoParams = function() {
    log.debug(`setRoleIdParams: `);
    return Promise.resolve({
        query: 'select role_id, role_name from roles',
        params: []
    });
}

exports.getRoleInfoData = (result) => {
    log.debug(`getRoleInfoData: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        let roleInfo = [];
        result.forEach((item) => {
            let roleObj = {
                roleId: item.role_id,
                roleName: helper.trimOrNull(item.role_name)
            };
            roleInfo.push(roleObj);
        });
        resolve(roleInfo);
    });
}

exports.getRoleOptionData = (result) => {
    log.debug(`getRoleOptionData: result = ${result}`);
    console.log(result);
    return new Promise((resolve, reject) => {
        let roleOption = [];
        result.forEach((item) => {
            let roleObj = {
                id: item.role_id,
                name: helper.trimOrNull(item.role_name)
            };
            roleOption.push(roleObj);
        });
        resolve(roleOption);
    });
}