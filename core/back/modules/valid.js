const lib = require('../../lib/');
const Validator = lib.valid.Validator;
const check = lib.valid.check;
const array = lib.meta.array;
const object = lib.meta.object;
const ShowError = require('./error').ShowError;
const error = require('./error');

exports.notUnd = function({ obj, props }) {
    return new Promise((resolve, reject) => {
        let validator = new Validator();
        let checkers = array.createByCounts([check.notUnd], [props.length]);
        let values = array.pushObjProps([], obj, props);
        if (!validator.check(checkers, values))
            reject(new ShowError(error.code('badReq'), error.mess("needParams", array.toStr(props))));
        else resolve();
    });
}

exports.paramCheckers = function(obj, props, checkers) {
    return object.create(['obj', 'props', 'checkers'], [obj, props, checkers]);
}

exports.checkers = function({ obj, props, checkers }) {
    return new Promise((resolve, reject) => {
        let validator = new Validator();
        let values = array.pushObjProps([], obj, props);
        let errors = array.forAndReturn(props, (elem, ind, arr) => arr[ind] = 'неверный ' + elem);
        if (!validator.check(checkers, values, errors))
            reject(new ShowError(error.code('badReq'), validator.errText));
        else resolve();
    });
}