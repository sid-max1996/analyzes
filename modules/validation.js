const log = require(appRoot + '/modules/log')(module);

exports.Validator = class Validator {
    constructor() {
        this.errorCount = 0;
        this.errorText = '';
    }

    get isHasError() {
        return this.errorCount > 0;
    }

    clear() {
        this.errorCount = 0;
        this.errorText = '';
    }

    doValidationOnce(value, validFun, error) {
        log.info(typeof validFun);
        if (!validFun(value)) {
            this.errorCount++;
            this.errorText += error + ' ';
        }
    }

    doValidationMany(values, validFunArr, errorArr) {
        values.forEach((value, index) => {
            this.doValidationOnce(value, validFunArr[index], errorArr[index]);
        });
    }

    static doValidation(value, validFun) {
        return validFun(value);
    }

}

exports.checkEmptyOrNull = (value) => {
    return !(value === "" || value === null || value === 'null' || value === undefined);
}

exports.checkPassword = (value) => {
    return typeof value == 'string' && value.length >= 8;
}

exports.checkRoleId = (value) => {
    return typeof value == 'number' && value >= 1 && value <= 3;
}

exports.checkEmail = (value) => {
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,3}$/i;
    return typeof value == 'string' && pattern.test(value);
}

exports.checkFetch = (value) => {
    const maxFetch = require(appRoot + '/config').get('default').maxFetch;
    return typeof value == 'number' && value > 0 && value <= maxFetch;
}

exports.checkOffset = (value) => {
    return typeof value == 'number' && value >= 0;
}

exports.checkArray = (value) => {
    return value instanceof Array;
}