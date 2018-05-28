exports.isArr = (arr) => {
    return arr instanceof Array;
}

exports.isNum = (value) => {
    return exports.notNull(value) && !isNaN(Number(value));
}

exports.isEq = (val1, val2) => {
    return typeof val1 === typeof val2 && val1 === val2;
}

exports.notEq = (val1, val2) => {
    return !exports.isEq(val1, val2);
}

exports.isFun = (fun) => {
    return typeof fun === 'function';
}

exports.isObj = (obj) => {
    return typeof obj === 'object';
}

exports.isNull = function(value) {
    return value === null || value === undefined;
}

exports.notNull = function(value) {
    return !exports.isNull(value);
}

exports.isUnd = function(value) {
    return value === undefined;
}

exports.notUnd = function(value) {
    return !exports.isUnd(value);
}

exports.isEmpty = (value) => {
    return value === "" || value === null || value === undefined;
}

exports.notEmpty = (value) => {
    return !exports.isEmpty(value);
}

exports.isEmptyObj = function(value) {
    return exports.isObj(value) && exports.notEmpty(value) && Object.keys(value).length == 0
}

exports.notEmptyObj = (value) => {
    return !exports.isEmptyObj(value);
}

exports.isPassword = (value) => {
    console.log('checkPassword ' + value);
    console.log(typeof value == 'string' && value.length >= 8);
    return typeof value == 'string' && value.length >= 8;
}

exports.isEqInArr = (values) => {
    if (!values instanceof Array)
        throw new Error('isEqInArr arg error');
    for (let i = 0; i < values.length - 1; i++) {
        if (!exports.isEq(values[i], values[i + 1]))
            return false;
    }
    return true;
}

exports.isRoleId = (value) => {
    value = Number(value);
    return value >= 1 && value <= 3;
}

exports.isEmail = (value) => {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,3}$/i;
    return typeof value == 'string' && pattern.test(value);
}

exports.isFetch = (value) => {
    value = Number(value);
    const maxFetch = 100;
    return typeof value == 'number' && value > 0 && value <= maxFetch;
}

exports.isOffset = (value) => {
    value = Number(value);
    return typeof value == 'number' && value >= 0;
}

exports.isImgSizeLimit = ({ img, maxKb }) => {
    if (!img instanceof Image) return false;
    console.log(img);
    return img.size / 1000 <= maxKb;
}

exports.isValInArr = (val, arr) => {
    if (!arr instanceof Array)
        throw new Error('isValInArr arg error');
    for (let i = 0; i < arr.length; i++) {
        if (exports.isEq(val, arr[i]))
            return true;
    }
    return false;
}

exports.size = function(value, size) {
    return value.length === size;
}