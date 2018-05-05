const auth = require('../service/auth');
const object = require('../meta/object');
const table = require('../jq/table');
const valid = require('../data/valid');

//компонент Alert
exports.showAlertError = function(isError, self, error, infoProp, textProp, showProp) {
    console.log(`showAlertError isError = ${isError}`);
    if (isError) object.setProps(self, [infoProp, textProp, showProp], ['danger', error, true]);
    else object.setProps(self, [infoProp, textProp, showProp], ['info', '', false]);
}

exports.showAlertToggle = function(isSuccess, self, error, success, infoProp, textProp, showProp) {
    console.log(`showAlertToggle isSuccess = ${isSuccess}`);
    if (!isSuccess) {
        exports.showAlertError(true, self, error);
    } else {
        object.setProps(
            self, [infoProp, textProp, showProp], ['info', success, true]);
        object.setPropsPause(self, [showProp], [false], 2500);
    }
}

//компонент ModalBox
exports.hideModalBox = function(self, isShowProp, textProp) {
    self[isShowProp] = false;
    self[textProp] = '';
}

exports.showModalBox = function(self, text, isShowProp, textProp) {
    self[isShowProp] = true;
    self[textProp] = text;
}

//компонент Table 
exports.doTableRemove = function(self, method, tableElem, idList, isShowProp, textProp) {
    console.log(idList);
    idList.forEach(id => {
        let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
        table.toggleRowClass(tr, 'tr-edit');
    });
    auth.nextAccess()
        .then(() => Promise.resolve(idList))
        .then(method)
        .then((answer) => {
            console.log("removeItems answer");
            console.log(answer);
            if (answer.success === false) {
                exports.showModalBox(self, answer.error, isShowProp, textProp);
            } else idList.forEach(id => {
                let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
                tr.remove();
            });

        })
        .catch((err) => console.log(err));
}

exports.doTableEdit = function(self, method, tableElem, id, newRow, isShowProp, textProp) {
    console.log('editRow id: ' + id);
    console.log('editRow newRow: ');
    console.log(newRow);
    let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
    table.toggleRowClass(tr, 'tr-edit');
    auth.nextAccess()
        .then(() => Promise.resolve(newRow))
        .then(method)
        .then((answer) => {
            console.log("editRow answer");
            console.log(answer);
            if (answer.success === false) {
                table.toggleRowClass(tr, 'tr-danger', 'tr-edit');
                table.removeRowClassPause(tr, 'tr-danger', 2500);
                exports.showModalBox(self, answer.error, isShowProp, textProp);
            } else table.removeRowClassPause(tr, 'tr-edit', 1500);
        })
        .catch((err) => {
            table.toggleRowClass(tr, 'tr-danger', 'tr-edit');
            table.removeRowClassPause(tr, 'tr-danger', 2500);
            console.log(err);
        });
}

exports.tableParams = function(tableObj, rowCount, idList) {
    let tableObjClone = object.clone(tableObj);
    tableObjClone.curCount = rowCount;
    tableObjClone.idList = idList;
    return tableObjClone;
}

exports.tableData = function(data, props) {
    if (!valid.isHasValue(data)) return [];
    return object.intoTwoArr(data, props);
}

exports.setTableIdList = function(self, data, idListProp, idProp) {
    if (!valid.isHasValue(data)) return;
    let idList = [];
    data.forEach(item => idList.push(item[idProp]));
    self[idListProp] = idList;
}