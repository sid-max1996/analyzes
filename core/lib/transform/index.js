const object = require('../meta').object;
const check = require('../validation').check;
const List = require('../collections').List;

const valMethod = function(value, transFunArr) {
    let transList = new List('function', transFunArr);
    transList.forEach(transFun =>
        value = transFun(value));
    return value;
}

const arrMethod = function(valueList, transFunArr) {
    if (!check.isArr(valueList))
        throw new Error('arrMethod: param not an array');
    let resArr = [];
    valueList.forEach(value =>
        resArr.push(valMethod(value, transFunArr)));
    return resArr;
}

const objMethod = function(obj, transFunArr) {
    if (!check.isObj(obj))
        throw new Error('objMethod: param not an object');
    let objClone = object.clone(obj);
    for (let key in objClone) {
        let value = objClone[key];
        objClone[key] = valMethod(value, transFunArr);
    }
    return objClone;
}

const transform = function(param, transFunArr) {
    if (check.isArr(param)) return arrMethod(param, transFunArr);
    else if (check.isObj(param)) return objMethod(param, transFunArr);
    else return valMethod(param, transFunArr);
}

module.exports = {
    transform: transform,
    filters: require('./filters')
}