exports.jsonNullFilter = function(value) {
    return value == "null" ? null : value;
}

exports.getSessionId = function() {
    return sessionStorage.getItem('sessionId');
}