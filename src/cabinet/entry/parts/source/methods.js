const info = require('../../../../front_modules/service/info');
const users = require('../../../../front_modules/service/users');
const admin = require('../../../../front_modules/service/users/admin');
const calc = require('../../../../front_modules/helper/calc');

exports.fetchCabinetInfo = () => {
    return info.fetchInfo(
        users.getCabinetData, ['userName', 'roleName', 'aboutYourself', 'photoUrl', 'defaultPhotoPath']
    );
}

exports.fetchAnketaInfo = () => {
    return info.fetchInfo(
        users.getAnketaData, ['firstName', 'secondName', 'phone', 'city', 'workPlace', 'aboutYourself']
    );
}

exports.fetchSettingsInfo = () => {
    return info.fetchInfo(users.getSettingsData, ['email']);
}

exports.fetchAdminInfo = (params) => {
    let { pageNum, rowCount, filter } = params;
    return info.fetchData(admin.getUsers, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                obj.filter = filter;
                console.log(obj);
                resolve(obj);
            });
    }));
}