const front = require('../../../../core/front');
const data = front.meta.data;
const anal = front.serv.anal;
const calc = front.help.calc;

exports.fetchGroupsData = ({ pageNum, rowCount, filter }) => {
    return data.fetch(anal.getGroupsData, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                obj.filter = filter;
                console.log(obj);
                resolve(obj);
            });
    }));
}

exports.fetchColsData = () => {
    return data.fetch(anal.getColsData);
}

exports.fetchAnalyzesData = ({ pageNum, rowCount, filter, groupId }) => {
    if (!groupId) return Promise.resolve();
    else return data.fetch(anal.getAnalyzesData, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                console.log('fetchAnalyzesInfo: ' + groupId);
                obj.filter = filter;
                obj.groupId = groupId;
                console.log(obj);
                resolve(obj);
            });
    }));
}

exports.fetchGroupInfo = (groupId) => {
    console.log('fetchGroupInfo ' + groupId);
    return data.fetch(
        anal.getGroupInfo,
        Promise.resolve(groupId)
    );
}


exports.fetchGroupSettings = (groupId) => {
    console.log('fetchGroupSettings ' + groupId);
    return data.fetch(
        anal.getGroupSettings,
        Promise.resolve(groupId)
    );
}


exports.fetchAddGroupData = ({ pageNum, rowCount, filter }) => {
    console.log('fetchAddGroupData ' + pageNum);
    return data.fetch(anal.getAddGroupData, new Promise((resolve, reject) => {
        calc.offsetAndFetch({ pageNum: pageNum, rowCount: rowCount })
            .then((obj) => {
                obj.filter = filter;
                console.log(obj);
                resolve(obj);
            });
    }));
}