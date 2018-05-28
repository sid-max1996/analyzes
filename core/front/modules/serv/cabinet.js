const lib = require('../lib');
const ajax = lib.ajax;
const local = lib.local;
const coreLib = require('../../../lib');
const array = coreLib.meta.array;
const check = coreLib.valid.check;

exports.getCabinetData = function() {
    return ajax.api('POST', 'cabinet', ['sessionId'], [local.sessId()]);
}

exports.getAnketaData = function() {
    return ajax.api('POST', 'anketa', ['sessionId'], [local.sessId()]);
}

exports.saveAnketa = function({ firstName, secondName, phone, city, workPlace, aboutYourself }) {
    let props = ['sessionId', 'firstName', 'secondName', 'phone', 'city', 'workPlace', 'aboutYourself'];
    let values = [local.sessId(), firstName, secondName, phone, city, workPlace, aboutYourself]
    return ajax.api('PUT', 'anketa', props, values);
}

exports.getSettingsData = function() {
    return ajax.api('POST', 'settings', ['sessionId'], [local.sessId()]);
}

exports.saveSettings = function({ email, password, photoUrl }) {
    let props = ['sessionId', 'email'];
    let values = [local.sessId(), email];
    array.pushIfMany([check.notEmpty(password), check.notEmpty(photoUrl)], props, ['password', 'photoUrl']);
    array.pushIfMany([check.notEmpty(password), check.notEmpty(photoUrl)], values, [password, photoUrl]);
    return ajax.api('PUT', 'settings', props, values);
}

exports.getUsers = function({ fetch, offset, filter }) {
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.sessId(), fetch, offset, filter]
    return ajax.api('POST', 'users', props, values);
}

exports.addUser = function({ userName, roleId, password, email }) {
    let props = ['sessionId', 'userName', 'roleId', 'password', 'email'];
    let values = [local.sessId(), userName, roleId, password, email];
    return ajax.api('PUT', 'add/user', props, values);
}

exports.updateUser = function({ id, newRow }) {
    let { userId, roleId, userName, userEmail } = newRow;
    let props = ['sessionId', 'userId', 'roleId', 'userName', 'email'];
    let values = [local.sessId(), userId, roleId, userName, userEmail];
    return ajax.api('PUT', 'update/user', props, values);
}

exports.removeUsers = function(idList) {
    return ajax.api('DELETE', 'users', ['sessionId', 'idList'], [local.sessId(), idList]);
}