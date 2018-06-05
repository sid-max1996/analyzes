const check = require('../../validation').check;
const object = require('../object');

exports.pushIf = function(flag, arr, val) {
    if (flag) arr.push(val);
    return arr;
}

exports.pushIfMany = function(flags, arr, values) {
    flags.forEach((flag, i) => exports.pushIf(flag, arr, values[i]));
    return arr;
}

exports.pushObjProps = function(arr, obj, props) {
    props.forEach(prop => {
        arr.push(obj[prop]);
    });
    return arr;
}

exports.createByObjProps = function(obj, props) {
    res = exports.pushObjProps([], obj, props);
    return res;
}

exports.createByObjProp = function(obj, prop) {
    res = exports.pushObjProps([], obj, [prop]);
    return res;
}

exports.pushAndReturn = function(arr, val) {
    arr.push(val);
    return arr;
}

exports.merge = function(arr1, arr2) {
    let arr = [];
    arr1.forEach(val => arr.push(val));
    arr2.forEach(val => arr.push(val));
    return arr;
}

exports.clone = function(arr) {
    return arr.slice(0);
}

exports.empty = function() {
    return [];
}

exports.createByCount = function(val, count) {
    let res = [];
    for (let i = 0; i < count; i++) res.push(val);
    return res;
}

exports.createByCounts = function(values, counts = []) {
    if (check.isUnd(values)) return [];
    if (!check.isArr(values) || !check.isArr(counts) ||
        (check.notEq(counts.length, 0) && check.notEq(counts.length, values.length)))
        throw new Error('array create params');
    if (check.isEq(counts.length, 0))
        values.forEach(val => counts.push(1));
    let arr = [];
    values.forEach((val, ind) => {
        for (let i = 0; i < counts[ind]; i++)
            arr.push(val);
    });
    console.log(arr);
    return arr;
}

exports.toStr = function(strArr, del = "") {
    let res = [];
    if (strArr.length === 0) return "";
    for (let i = 0; i < strArr.length - 1; i++)
        res += strArr[i] + del + " ";
    res += strArr[strArr.length - 1];
    return res;
}

exports.forAndReturn = function(arr, fun) {
    arr.forEach(fun);
    return arr;
}

exports.has = function(arr, val) {
    console.log(val);
    for (let i = 0; i < arr.length; i++)
        if (check.isEq(arr[i], val))
            return true;
    return false;
}

exports.intoTwoArray = function(arr) {
    if (check.isUnd(arr)) return [];
    let res = [];
    for (let i = 0; i < arr.length; i++)
        res.push([arr[i]]);
    return res;
}