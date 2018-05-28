const object = require('../object');

exports.freshProps = function(objArr, props, oldProps) {
    if (!objArr) return [];
    let res = [];
    objArr.forEach(obj => {
        res.push(object.freshProps(obj, props, oldProps));
    });
    return res;
}

exports.propsFunRename = function(objArr, filFun) {
    if (!objArr) return [];
    objArr.forEach(obj => {
        object.propsFunRename(obj, filFun);
    });
    return objArr;
}

exports.intoPropsArrList = function(objArr, props) {
    if (!objArr) return [];
    let res = [];
    objArr.forEach(obj => {
        let row = [];
        props.forEach(prop => row.push(obj[prop]));
        res.push(row);
    });
    return res;
}

exports.intoPropArrayList = function(objArr, prop) {
    return exports.intoPropsArrList(objArr, [prop]);
}

exports.findObjWithProp = function(objArr, prop, value) {
    if (!objArr) return [];
    for (let i = 0; i < objArr.length; i++)
        if (objArr[i][prop] === value)
            return objArr[i];
    return null;
}

exports.intoArray = function(objArr, prop) {
    if (!objArr) return [];
    let res = [];
    objArr.forEach(obj => res.push(obj[prop]));
    return res;
}

exports.clone = function(objArr) {
    if (!objArr) return [];
    let clone = [];
    objArr.forEach(obj => clone.push(object.clone(obj)));
    return clone;
}