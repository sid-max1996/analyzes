const ajax = require('../src/ajax');
const local = require('../src/local');

exports.getUsers = function({ fetch, offset, filter }) {
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.getSessionId(), fetch, offset, filter]
    return ajax.api('users', props, values);
}

exports.addUser = function({ userName, roleId, password, email }) {
    let props = ['sessionId', 'userName', 'roleId', 'password', 'email'];
    let values = [local.getSessionId(), userName, roleId, password, email]
    return ajax.api('add/user', props, values);
}

exports.updateUser = function({ userId, roleId, userName, email }) {
    let props = ['sessionId', 'userId', 'roleId', 'userName', 'email'];
    let values = [local.getSessionId(), userId, roleId, userName, email]
    return ajax.api('update/user', props, values);
}

exports.removeUsers = function(idList) {
    return ajax.api('remove/users', ['sessionId', 'idList'], [local.getSessionId(), idList]);
}