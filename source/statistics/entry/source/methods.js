const front = require('../../../../core/front');
const data = front.meta.data;
const stat = front.serv.stat;
const calc = front.help.calc;

exports.fetchSelectionsData = ({ pageNum, rowCount, filter }) => {
    return data.fetch(stat.getSelectionsData, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                obj.filter = filter;
                console.log(obj);
                resolve(obj);
            });
    }));
}

exports.fetchAddSelectionInfo = ({ pageNum, rowCount, filter }) => {
    console.log('fetchAddSelectionInfo ');
    return data.fetch(stat.getAddSelectionInfo, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                obj.filter = filter;
                console.log(obj);
                resolve(obj);
            });
    }));
}

exports.fetchAddRecordsInfo = (selId) => {
    console.log('fetchAddRecordsInfo ' + selId);
    return data.fetch(
        stat.getAddRecordsInfo,
        Promise.resolve(selId)
    );
}

exports.fetchStatisticsInfo = (selId) => {
    console.log('fetchStatisticsInfo ' + selId);
    return data.fetch(
        stat.getStatisticsInfo,
        Promise.resolve(selId)
    );
}