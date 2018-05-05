exports.clone = function(obj) {
    var clone = {};
    for (var key in obj) {
        clone[key] = obj[key];
    }
    return clone;
}

exports.intoTwoArr = function(data, props) {
    let res = [];
    data.forEach(item => {
        let row = [];
        props.forEach(prop => row.push(item[prop]));
        res.push(row);
    });
    return res;
}

exports.setProps = function(obj, props, values) {
    props.forEach((prop, ind) => {
        obj[prop] = values[ind];
    });
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

exports.intoArray = function(obj, props) {
    let res = [];
    props.forEach(prop => {
        res.push(obj[prop]);
    });
    return res;
}