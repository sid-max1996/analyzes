const front = require('../../../../../core/front');
const data = front.meta.data;
const cabinet = front.serv.cabinet;
const calc = front.help.calc;

exports.fetchCabinetInfo = () => {
    return data.fetch(cabinet.getCabinetData);
}

exports.fetchAnketaInfo = () => {
    return data.fetch(cabinet.getAnketaData);
}

exports.fetchSettingsInfo = () => {
    return data.fetch(cabinet.getSettingsData);
}

exports.fetchAdminInfo = (params) => {
    let { pageNum, rowCount, filter, roleId } = params;
    if (roleId >= 3) {
        return data.fetch(cabinet.getUsers, new Promise((resolve, reject) => {
            calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
                .then((obj) => {
                    obj.filter = filter;
                    console.log(obj);
                    resolve(obj);
                });
        }));
    } else return Promise.resolve({});
}