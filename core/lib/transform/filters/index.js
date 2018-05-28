exports.json = function(value) {
    return value === "null" ? null : value;
}

exports.string = function(value) {
    return value.toString();
}

exports.objTrim = function(obj) {
    if (typeof obj !== 'object') return obj;
    for (let key in obj)
        obj[key] = typeof obj[key] === "string" ? obj[key].trim() : obj[key];
    return obj;
}

exports.trim = function(str) {
    if (typeof str != "string") return str;
    else return str.trim();
}

exports.camelToC = function(str) {
    if (typeof str != "string") return str;
    let res = '';
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === str.charAt(i).toUpperCase())
            res += '_' + str.charAt(i).toLowerCase();
        else res += str.charAt(i);
    }
    return res;
}

exports.cToCamel = function(str) {
    if (typeof str != "string") return str;
    let res = '';
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '_') {
            if (i + 1 < str.length) i += 1;
            res += str.charAt(i).toUpperCase();
        } else res += str.charAt(i);
    }
    return res;
}

exports.objCToCamel = function(obj) {
    if (typeof obj !== 'object') return obj;
    let newObj = {};
    for (let key in obj)
        newObj[exports.cToCamel(key)] = obj[key];
    return newObj;
}