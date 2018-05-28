const List = require('../collections').List;
const check = require('./check');

const Validator = class Validator {
    constructor() {
        this.errCount = 0;
        this.errText = '';
    }

    get isError() {
        return this.errCount !== 0
    }

    clear() {
        this.errCount = 0;
        this.errText = '';
    }

    checkVal(checker, param, error) {
        if (!checker(param)) {
            this.errCount++;
            if (error) this.errText += error + ' ';
            return false;
        }
        return true;
    }

    check(checkers, params, errors = []) {
        let checkList = new List('function', checkers);
        if (check.isArr(params) && check.isArr(errors) &&
            check.isEq(checkers.length, params.length)) {
            checkList.forEach((checkFun, ind) => {
                if (!checkFun(params[ind])) {
                    this.errCount++;
                    if (errors.length > ind)
                        this.errText += errors[ind] + ' ';
                }
            });
            return !this.isError;
        } else throw new Error('Validator params error');
    }
}

module.exports = {
    Validator: Validator,
    check: require('./check')
}