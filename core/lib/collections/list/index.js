module.exports = class List {
    constructor(type, arr) {
        if (arr instanceof Array) {
            arr.forEach(val => {
                if (typeof val !== type)
                    throw new Error('List constructor: arr elem type not ' + type);
            });
            this.type = type;
            this.instance = arr.slice(0);
        } else throw new Error('List constructor: param not an array');
    }

    get size() {
        return this.instance.length;
    }

    copy() {
        return this.instance.slice(0);
    }

    clear() {
        this.instance = [];
    }

    push(value) {
        if (typeof value !== this.type)
            throw new Error('List constructor: arr elem type not ' + this.type);
        this.instance.push(value);
    }

    pop() {
        this.instance.pop();
    }

    pushArr(values) {
        values.forEach(value => this.push(value));
    }

    popMany(count) {
        for (let i = 0; i < count; i++) this.pop();
    }

    isPred(predFun) {
        this.instance.forEach(value => {
            if (!predFun) return false;
        });
        return true;
    }

    forEach(func) {
        this.instance.forEach(func);
    }
}