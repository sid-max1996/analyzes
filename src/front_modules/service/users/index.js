const ajax = require('../src/ajax.js');
const local = require('../src/local');
const arr = require('../../meta/array');

exports.getCabinetData = function() {
    return ajax.api('get/userCabinet', ['sessionId'], [local.getSessionId()]);
}

exports.getAnketaData = function() {
    return ajax.api('get/userAnketa', ['sessionId'], [local.getSessionId()]);
}

exports.saveAnketa = function({ firstName, secondName, phone, city, workPlace, aboutYourself }) {
    let props = ['sessionId', 'firstName', 'secondName', 'phone', 'city', 'workPlace', 'aboutYourself'];
    let values = [local.getSessionId(), firstName, secondName, phone, city, workPlace, aboutYourself]
    return ajax.api('save/userAnketa', props, values);
}

exports.getSettingsData = function() {
    return ajax.api('get/userSettings', ['sessionId'], [local.getSessionId()]);
}

exports.saveSettings = function({ email, password, photoUrl }) {
    let props = ['sessionId', 'email'];
    let values = [local.getSessionId(), email];
    arr.pushPropsValues(props, values, ['password', 'photoUrl'], [password, photoUrl]);
    return ajax.api('save/userSettings', props, values);
}