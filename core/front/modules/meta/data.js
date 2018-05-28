const auth = require('../serv').auth;
const coreLib = require('../../../lib');
const object = coreLib.meta.object;
const filter = coreLib.modif.filters;
const transform = coreLib.modif.transform;
const check = coreLib.valid.check;

exports.fetchStore = function(store, storeMethod, fetchMethod, params) {
    return new Promise((resolve, reject) => {
        fetchMethod(params)
            .then((contentInfo) => {
                store.commit(storeMethod, contentInfo);
                resolve(contentInfo);
            })
            .catch((err) => reject(err));
    });
}

exports.fetchTable = function(store, storeMethod, fetchMethod, params, action = "simple") {
    console.log('fetchTable');
    console.log(params);
    let pageNum = 1;
    let rowCount = store.state.default.rowCount;
    let filter = null;
    let objParams = object.setProps(params ? object.clone(params) : {}, ['pageNum', 'rowCount', 'filter', 'action'], [pageNum, rowCount, filter, action]);
    if (check.notNull(params)) {
        if (params.pageNum) pageNum = params.pageNum;
        if (params.rowCount) rowCount = params.rowCount;
        if (params.filter) filter = params.filter;
        object.setProps(objParams, ['pageNum', 'rowCount', 'filter'], [pageNum, rowCount, filter])
    }
    console.log(objParams);
    return exports.fetchStore(store, storeMethod, fetchMethod, objParams);
}

exports.fetch = function(method, prepare = Promise.resolve()) {
    return new Promise((resolve, reject) => {
        auth.nextAccess()
            .then(() => prepare)
            .then(method)
            .then((data) => resolve(transform(data, [filter.json])))
            .catch((err) => reject(err));
    });
}