const lib = require('../../../lib');
const check = lib.valid.check;
const Validator = lib.valid.Validator;
const fil = lib.modif.filters;

exports.sessId = function() {
    return localStorage.getItem('sessionId');
}

exports.get = function(name) {
    return localStorage.getItem(name);
}

exports.set = function(name, value) {
    return localStorage.setItem(name, fil.string(value));
}

exports.setItems = function(names, values) {
    let validator = new Validator();
    let checkers = [check.isArr, check.isArr, check.isEqInArr];
    let params = [names, values, [names.length, values.length]];
    if (validator.check(checkers, params)) {
        names.forEach((name, ind) => {
            localStorage.setItem(name, fil.string(values[ind]));
        });
    }
}