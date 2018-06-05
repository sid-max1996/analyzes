const lib = require('../lib');
const ajax = lib.ajax;
const local = lib.local;

exports.getSelectionsData = function({ fetch, offset, filter }) {
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.sessId(), fetch, offset, filter]
    return ajax.api('POST', 'selections', props, values);
}

exports.getAddSelectionInfo = function({ fetch, offset, filter }) {
    console.log('getAddSelectionInfo');
    let props = ['sessionId', 'fetch', 'offset', 'filter'];
    let values = [local.sessId(), fetch, offset, filter]
    return ajax.api('POST', 'selection/add/info', props, values);
}

exports.getAddRecordsInfo = function(selId) {
    console.log('getAddRecordsInfo ' + selId);
    return ajax.api('POST', 'selection/records/info', ['sessionId', 'selId'], [local.sessId(), selId]);
}

exports.addSelection = function({ selName, groupId }) {
    console.log('addSelection');
    return ajax.api('PUT', 'selection', ['sessionId', 'selName', 'groupId'], [local.sessId(), selName, groupId]);
}

exports.getSelItems = function({ selId, filter }) {
    let props = ['sessionId', 'filter', 'selId'];
    let values = [local.sessId(), filter, selId]
    return ajax.api('POST', 'selection/items', props, values);
}

exports.removeSelItems = function(selId) {
    return ajax.api('DELETE', 'selection/items', ['sessionId', 'selId'], [local.sessId(), selId]);
}

exports.pushSelItems = function({ selId, ids }) {
    console.log('addSelection');
    return ajax.api('PUT', 'selection/items', ['sessionId', 'selId', 'ids'], [local.sessId(), selId, ids]);
}

exports.getSelInfo = function(selId) {
    console.log('getSelInfo ' + selId);
    return ajax.api('POST', 'selection/info', ['sessionId', 'selId'], [local.sessId(), selId]);
}

exports.removeSel = function(selId) {
    return ajax.api('DELETE', 'selection', ['sessionId', 'selId'], [local.sessId(), selId]);
}

exports.getStatisticsInfo = function(selId) {
    console.log('getStatisticsInfo ' + selId);
    return ajax.api('POST', 'statistics/info', ['sessionId', 'selId'], [local.sessId(), selId]);
}

exports.getPercentCols = function(selId, cols) {
    console.log('getPercentCols ' + selId);
    return ajax.api('POST', 'statistics/calc/cols', ['sessionId', 'selId', 'cols'], [local.sessId(), selId, cols]);
}

exports.getFiltersCalc = function(selId, filters) {
    console.log('getFiltersCalc ' + selId);
    return ajax.api('POST', 'statistics/calc/filters', ['sessionId', 'selId', 'filters'], [local.sessId(), selId, filters]);
}

exports.getAllelesCols = function(selId, cols) {
    console.log('getPercentCols ' + selId);
    return ajax.api('POST', 'statistics/calc/alleles', ['sessionId', 'selId', 'cols'], [local.sessId(), selId, cols]);
}

exports.getXiSquereCols = function(selId1, selId2, cols) {
    return ajax.api('POST', 'statistics/calc/xisquere', ['sessionId', 'selId1', 'selId2', 'cols'], [local.sessId(), selId1, selId2, cols]);
}