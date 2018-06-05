const lib = require('../../../../../core/lib');
const back = require('../../../../../core/back');
const log = back.log(module);
const ShowError = back.error.ShowError;
const meta = lib.meta;
const mod = lib.modif;
const fil = mod.filters;
const check = lib.valid.check;
const metaDb = back.db.meta;
const error = back.error;

exports.succFun = (result) => {
    return Promise.resolve({ success: true });
}

exports.checkError = (result) => {
    log.debug(`after: checkError: result err = ${result.error}`);
    return Promise.resolve(back.db.query.jsonSucc(result));
}

//getSelections
exports.getSelections = (resArr) => {
    log.debug(`after: getSelections: resArr = ${resArr}`);
    let data = metaDb.objArrConvert(resArr[0]);
    let count = resArr[1][0].count;
    return Promise.resolve(meta.object.create(['count', 'data'], [count, data]));
}

//getAddSelection
exports.getAddSelection = (resArr) => {
    log.debug(`after: getAddSelection: resArr = ${resArr}`);
    let data = metaDb.objArrConvert(resArr[0]);
    let count = resArr[1][0].count;
    return Promise.resolve(meta.object.create(['groupsCount', 'groups'], [count, data]));
}

//getSelItems
exports.getSelItems = (res) => {
    log.debug(`after: getSelItems: res = ${res}`);
    //let data = metaDb.objArrConvert(res);
    let ids = meta.objArr.intoArray(res, 'main_id');
    return Promise.resolve(meta.object.create(['ids'], [ids]));
}

//getSelInfo
exports.getSelInfo = (resArr) => {
    log.debug(`after: getSelInfo: resArr = ${resArr}`);
    let selCount = resArr[0][0].count;
    let groupCount = resArr[1][0].count;
    return Promise.resolve(meta.object.create(['selCount', 'groupCount'], [selCount, groupCount]));
}

//getStatCalcCols
exports.getStatCalcCols = (resArr) => {
    log.debug(`after: getStatCalcCols: resArr = ${resArr}`);
    let allCount = resArr[0][0].count;
    let calc = [];
    for (let i = 1; i < resArr.length; i++) {
        let { count, name, res } = resArr[i][0];
        let percent = count / (allCount / 100);
        percent = Math.round(percent) + Math.round((percent % 1) * 100) / 100;
        calc.push(meta.object.create(['count', 'name', 'res', 'percent'], [count, name, res, percent]));
    }
    return Promise.resolve(meta.object.create(['allCount', 'calc'], [allCount, calc]));
}

//getStatCalcFilters
exports.getStatCalcFilters = (resArr) => {
    log.debug(`after: getStatCalcFilters: resArr = ${resArr}`);
    let allCount = resArr[0][0].count;
    let count = resArr[1][0].count;
    let percent = count / (allCount / 100);
    percent = Math.round(percent) + Math.round((percent % 1) * 100) / 100;
    return Promise.resolve(meta.object.create(['allCount', 'calc'], [allCount, { count: count, percent: percent }]));
}

//getStatCalcAlleles
exports.getStatCalcAlleles = (resArr) => {
    log.debug(`after: getStatCalcAlleles: resArr = ${resArr}`);
    let allCount = resArr[0][0].count;
    let cont = [];
    for (let i = 1; i < resArr.length; i++) {
        let { count, name, res } = resArr[i][0];
        cont.push(meta.object.create(['count', 'name', 'res'], [count, name, res]));
    }
    let calc = [];
    let analSet = new Set();
    cont.forEach(el1 => {
        if (!analSet.has(el1.name)) {
            analSet.add(el1.name);
            let analyzes = [];
            let analMap = new Map();
            let sum = 0;
            cont.forEach(el2 => {
                if (el2.name === el1.name) {
                    analyzes.push(el2);
                    analMap[el2.res] = el2.count;
                    sum += el2.count;
                }
            });
            //определяем аллели
            let alleles = [];
            let allelSet = new Set();
            analyzes.forEach(anal => {
                for (let i = 0; i < anal.res.length; i++) {
                    if (!allelSet.has(anal.res[i])) {
                        alleles.push(anal.res[i]);
                        allelSet.add(anal.res[i]);
                    }
                }
            });
            let al1 = alleles[0];
            let al2 = alleles[1];
            let freq1 = (2 * analMap[al1 + al1] + (analMap[al1 + al2] ? analMap[al1 + al2] : analMap[al2 + al1])) / (2 * sum);
            let freq2 = (2 * analMap[al2 + al2] + (analMap[al1 + al2] ? analMap[al1 + al2] : analMap[al2 + al1])) / (2 * sum);
            calc.push({ name: el1.name, al: al1, freq: freq1 });
            calc.push({ name: el1.name, al: al2, freq: freq2 });
        }
    });
    return Promise.resolve(meta.object.create(['allCount', 'calc'], [allCount, calc]));
}

//getStatCalcXiSquere
exports.getStatCalcXiSquere = (resArr) => {
    log.debug(`after: getStatCalcXiSquere: resArr = ${resArr}`);
    let calc = [];
    resArr.forEach(res => {
        let xi = 0;
        log.info('!Q!!!!!QQQQQQQQQQQQQQQq');
        console.log(res);
        for (let i = 1; i < res.length; i += 2) {
            if (res[i][0].count !== 0)
                xi += Math.pow((res[i][0].count - res[i + 1][0].count), 2) / res[i][0].count;
        }
        calc.push({ name: res[0][0].name, xi: xi })
    });
    return Promise.resolve(meta.object.create(['calc'], [calc]));
}