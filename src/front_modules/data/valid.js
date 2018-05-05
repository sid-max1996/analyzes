exports.Validator = class Validator {
    constructor() {
        this.errCount = 0;
        this.errText = '';
    }

    get isError() {
        return this.errCount > 0;
    }

    clear() {
        this.errCount = 0;
        this.errText = '';
    }

    doValidOnce(error, validFun, value) {
        if (!validFun(value)) {
            this.errCount++;
            this.errText += error + ' ';
        }
    }

    doValidMany(errorArr, validFunArr, valueList) {
        valueList.forEach((value, index) => {
            this.doValidOnce(errorArr[index], validFunArr[index], value);
        });
    }

    static doValid(validFun, ...values) {
        return validFun(values);
    }

}

exports.checkNotEmpty = (value) => {
    return !(value === "" || value === null || value === undefined);
}

exports.isNotEmpty = (value) => {
    return !(value === "" || value === null || value === undefined);
}

exports.isHasValue = function(value) {
    return value !== null && value !== undefined;
}

exports.checkPassword = (value) => {
    console.log('checkPassword ' + value);
    console.log(typeof value == 'string' && value.length >= 8);
    return typeof value == 'string' && value.length >= 8;
}

exports.checkEqual = (values) => {
    if (!values instanceof Array || values.length != 2) return false;
    console.log('checkEqual ' + values[0] + " " + values[1]);
    console.log(values[0] === values[1]);
    return values[0] === values[1];
}

exports.checkImgSize = ({ img, maxKb }) => {
    if (!img instanceof Image || !maxKb instanceof Number) return false;
    return img.size / 1024 <= maxKb;
}