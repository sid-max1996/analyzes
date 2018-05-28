exports.clone = function(obj) {
    var clone = {};
    for (var key in obj) {
        clone[key] = obj[key];
    }
    return clone;
}

exports.getProp = function(obj, prop) {
    if (!obj) return null;
    return obj[prop];
}

exports.setProp = function(obj, prop, value) {
    obj[prop] = value;
    return obj;
}

exports.setProps = function(obj, props, values) {
    props.forEach((prop, ind) => {
        obj[prop] = values[ind];
    });
    return obj;
}

exports.create = function(props, values) {
    let obj = new Object();
    exports.setProps(obj, props, values);
    return obj;
}

exports.setPropsPause = function(obj, props, values, miliSec) {
    setTimeout(() => {
        exports.setProps(obj, props, values);
    }, miliSec);
}

exports.intoArrayByProps = function(obj, props) {
    let res = [];
    props.forEach(prop => {
        res.push(obj.hasOwnProperty(prop) ? obj[prop] : null);
    });
    return res;
}

exports.toArrayByProps = function(obj, props) {
    let res = [];
    props.forEach(prop => {
        res.push(obj.hasOwnProperty(prop) ? obj[prop] : null);
    });
    return res;
}

exports.createByProps = function(obj, props, oldProps) {
    let res = {};
    props.forEach((prop, ind) => {
        res[prop] = obj.hasOwnProperty(oldProps[ind]) ? obj[oldProps[ind]] : null;
    });
    return res;
}

exports.freshProps = function(obj, props, oldProps) {
    var newObj = {};
    props.forEach((prop, ind) => {
        newObj[prop] = obj[oldProps[ind]];
    });
    return newObj;
}

exports.merge = function(obj1, obj2) {
    let res = exports.clone(obj1);
    for (var key in obj2) res[key] = obj2[key];
    return res;
}

exports.propsFunRename = function(obj, filFun) {
    for (let prop in obj) {
        let val = obj[prop];
        delete obj[prop];
        obj[filFun(prop)] = val;
    }
    return obj;
}

exports.isVal = function(obj, prop, val) {
    if (obj === undefined || obj === null) return false;
    if (obj[prop] === val) return true;
    else return false;
}

exports.removeProps = function(obj, props) {
    props.forEach(prop => {
        delete obj[prop];
    });
    return obj;
}

exports.hasProps = function(obj, props) {
    let res = true;
    props.forEach(prop => {
        if (!obj[prop]) res = false;
    });
    return res;
}