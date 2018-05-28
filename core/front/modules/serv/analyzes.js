const lib = require('../lib');
const ajax = lib.ajax;
const local = lib.local;

exports.getGroupsData = function({ fetch, offset, filter }) {
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.sessId(), fetch, offset, filter]
    return ajax.api('POST', 'groups', props, values);
}

exports.getAddGroupData = function({ fetch, offset, filter }) {
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.sessId(), fetch, offset, filter]
    return ajax.api('POST', 'group/add/params', props, values);
}

exports.getColsData = function() {
    return ajax.api('POST', 'cols/data', ['sessionId'], [local.sessId()]);
}

exports.getAnalyzesData = function({ fetch, offset, filter, groupId }) {
    console.log('getAnalyzesData: ' + groupId);
    console.log(fetch);
    let props = ['sessionId', 'fetch', 'offset', 'filter', 'groupId'];
    let values = [local.sessId(), fetch, offset, filter, groupId];
    return ajax.api('POST', 'analyzes', props, values);
}

exports.getGroupInfo = function(groupId) {
    console.log('getGroupInfo ' + groupId);
    return ajax.api('POST', 'group/info', ['sessionId', 'groupId'], [local.sessId(), groupId]);
}

exports.addGroup = function({ groupName, membersIds, analIds, ankIds }) {
    console.log('addGroup');
    console.log(groupName);
    console.log(membersIds);
    console.log(analIds);
    console.log(ankIds);
    return ajax.api('PUT', 'add/group', ['sessionId', 'groupName', 'membersIds', 'analIds', 'ankIds'], [local.sessId(), groupName, membersIds, analIds, ankIds]);
}

exports.updateAnalyze = function({ id, newRow }) {
    let props = ['sessionId', 'newRow', 'id'];
    let values = [local.sessId(), newRow, id];
    return ajax.api('PUT', 'update/analyze', props, values);
}

exports.removeAnalyzes = function({ idList, groupId }) {
    console.log(groupId);
    return ajax.api('DELETE', 'analyzes', ['sessionId', 'idList', 'groupId'], [local.sessId(), idList, groupId]);
}

exports.saveAnalyzes = function({ rows, groupId }) {
    return ajax.api('PUT', 'save/analyzes', ['sessionId', 'rows', 'groupId'], [local.sessId(), rows, groupId]);
}

exports.getGroupSettings = function(groupId) {
    return ajax.api('POST', 'group/settings', ['sessionId', 'groupId'], [local.sessId(), groupId]);
}

exports.removeGroup = function(groupId) {
    return ajax.api('DELETE', 'group', ['sessionId', 'groupId'], [local.sessId(), groupId]);
}


exports.changeGroupName = function({ groupId, groupName }) {
    return ajax.api('PUT', 'group/name', ['sessionId', 'groupId', 'groupName'], [local.sessId(), groupId, groupName]);
}

exports.removeGroupMember = function({ groupId, userId }) {
    return ajax.api('DELETE', 'group/member', ['sessionId', 'groupId', 'userId'], [local.sessId(), groupId, userId]);
}

exports.addGroupMember = function({ groupId, userId }) {
    return ajax.api('PUT', 'group/member', ['sessionId', 'groupId', 'userId'], [local.sessId(), groupId, userId]);
}

exports.addGroupAnalyze = function({ groupId, analId }) {
    return ajax.api('PUT', 'group/analyze', ['sessionId', 'groupId', 'analId'], [local.sessId(), groupId, analId]);
}

exports.removeGroupAnalyze = function({ groupId, analId }) {
    return ajax.api('DELETE', 'group/analyze', ['sessionId', 'groupId', 'analId'], [local.sessId(), groupId, analId]);
}

exports.addGroupAnketa = function({ groupId, ankId }) {
    return ajax.api('PUT', 'group/anketa', ['sessionId', 'groupId', 'ankId'], [local.sessId(), groupId, ankId]);
}

exports.removeGroupAnketa = function({ groupId, ankId }) {
    return ajax.api('DELETE', 'group/anketa', ['sessionId', 'groupId', 'ankId'], [local.sessId(), groupId, ankId]);
}

exports.getColInfo = function({ id, type }) {
    return ajax.api('POST', 'col/info', ['sessionId', 'id', 'type'], [local.sessId(), id, type]);
}

exports.addColOption = function({ id, opId, type }) {
    return ajax.api('PUT', 'col/op', ['sessionId', 'id', 'opId', 'type'], [local.sessId(), id, opId, type]);
}

exports.removeColOption = function({ id, opId, type }) {
    return ajax.api('DELETE', 'col/op', ['sessionId', 'id', 'opId', 'type'], [local.sessId(), id, opId, type]);
}

exports.addColumn = function({ name, type, params }) {
    return ajax.api('PUT', 'col', ['sessionId', 'name', 'type', 'params'], [local.sessId(), name, type, params]);
}

exports.removeColumn = function({ id, type }) {
    return ajax.api('DELETE', 'col', ['sessionId', 'id', 'type'], [local.sessId(), id, type]);
}

exports.addOption = function({ name, type }) {
    return ajax.api('PUT', 'op', ['sessionId', 'name', 'type'], [local.sessId(), name, type]);
}

exports.removeOption = function({ id, type }) {
    return ajax.api('DELETE', 'op', ['sessionId', 'id', 'type'], [local.sessId(), id, type]);
}