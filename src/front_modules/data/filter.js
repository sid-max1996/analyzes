const object = require('../meta/object');

exports.Filter = class Filter {
    constructor(filters) {
        if (filters instanceof Array)
            this.filters = filters;
        else this.filters = [];
    }

    clearFilters() {
        this.filters = [];
    }

    pushFilter(filFun) {
        this.filters.push(filFun);
    }

    popFilter(filFun) {
        this.filters.pop();
    }

    filterVal(value) {
        let res = value;
        filters.forEach(filter =>
            res = filter(value));
        return res;
    }

    filterArr(valueList) {
        let resArr = [];
        valueList.forEach(value =>
            resArr.push(this.filterVal(value)));
        return resArr;
    }

    filterObj(obj) {
        let objClone = object.clone(obj);
        for (let key in objClone) {
            let value = objClone[key];
            objClone[key] = this.filterVal(value);
        }
        return objClone;
    }

    static valFilter(value, filterFun) {
        return filterFun(value);
    }

    static arrFilter(valueList, filterFun) {
        let resArr = [];
        valueList.forEach(value =>
            resArr.push(this.valFilter(value, filterFun)));
        return resArr;
    }

    static objFilter(obj, filterFun) {
        let objClone = object.clone(obj);
        for (let key in objClone) {
            let value = objClone[key];
            objClone[key] = this.valFilter(value, filterFun);
        }
        return objClone;
    }
}

exports.jsonFilter = function(value) {
    return value === "null" ? null : value;
}