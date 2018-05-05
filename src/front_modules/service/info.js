const ajax = require('./src/ajax');
const local = require('./src/local');
const filter = require('../data/filter');
const Filter = filter.Filter;
const object = require('../meta/object');
const auth = require('./auth');

exports.setSession = function(name, value) {
    return ajax.req('session/setValue', ['sessionId', 'name', 'value'], [local.getSessionId(), name, value]);
}

exports.getSession = function(name) {
    return ajax.req('session/getValue', ['sessionId', 'name'], [local.getSessionId(), name]);
}

exports.fetchStoreInfo = function(store, storeMethod, fetchMethod, params) {
    return new Promise((resolve, reject) => {
        fetchMethod(params)
            .then((contentInfo) => {
                store.commit(storeMethod, contentInfo);
                resolve();
            })
            .catch((err) => reject(err));
    });
}

exports.fetchInfo = function(method, props) {
    return new Promise((resolve, reject) => {
        auth.nextAccess()
            .then(method)
            .then((info) => {
                let values = object.intoArray(info, props);
                resolve(Filter.objFilter(object.create(props, values), filter.jsonFilter));
            })
            .catch((err) => reject(err));
    });
}

exports.fetchData = function(method, prepare = Promise.resolve()) {
    return new Promise((resolve, reject) => {
        auth.nextAccess()
            .then(() => prepare)
            .then(method)
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    });
}

exports.getRoleId = function() {
    return ajax.api('role', ['sessionId'], [local.getSessionId()], (data) => Promise.resolve(data.roleId));
}

exports.getRoleInfo = function() {
    return ajax.api('roleInfo');
}

exports.getOptionsInfo = function(infoName) {
    return ajax.api(`options/${infoName}`, [], [], (data) => {
        let options = [];
        data.forEach(item =>
            options.push({ title: item.name, value: item.id }));
        return Promise.resolve(options);
    });
}

exports.getMainTemplateInfo = function() {
    let menuInfo = {};
    let commandsInfo = {};
    return new Promise((resolve, reject) => {
        exports.getSession('isDarkScheme')
            .then((answer) => {
                if (answer.success === false)
                    return Promise.reject(new Error('не удалось получить параметр isDarkScheme'));
                menuInfo.isDarkScheme = answer.value;
                return Promise.resolve();
            })
            .then(exports.getRoleId)
            .then((roleId) => {
                commandsInfo.roleId = roleId;
                resolve({ menuInfo, commandsInfo });
            })
            .catch((err) => reject(err));
    });
}