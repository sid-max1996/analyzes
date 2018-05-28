const auth = require('../../serv/auth');
const table = require('../../jq/table');
const modal = require('../ModalBox/meta');

exports.doRemove = function(self, method, tableElem, idList, isShowProp, textProp, params) {
    console.log(idList);
    idList.forEach(id => {
        let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
        table.toggleRowClass(tr, 'tr-edit');
    });
    auth.nextAccess()
        .then(() => {
            if (params) return Promise.resolve(params);
            else return Promise.resolve(idList);
        })
        .then(method)
        .then((answer) => {
            console.log("removeItems answer");
            console.log(answer);
            if (answer.success === false) {
                modal.show(self, answer.error, isShowProp, textProp);
            } else idList.forEach(id => {
                let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
                tr.remove();
            });

        })
        .catch((err) => console.log(err));
}

exports.doEdit = function(self, method, tableElem, id, newRow, isShowProp, textProp) {
    console.log('editRow id: ' + id);
    console.log('editRow newRow: ');
    console.log(newRow);
    let tr = $(tableElem).find(`tr[data-id=${id}]`)[0];
    table.toggleRowClass(tr, 'tr-edit');
    auth.nextAccess()
        .then(() => Promise.resolve({ id: id, newRow: newRow }))
        .then(method)
        .then((answer) => {
            console.log("editRow answer");
            console.log(answer);
            if (answer.success === false) {
                table.toggleRowClass(tr, 'tr-danger', 'tr-edit');
                table.removeRowClassPause(tr, 'tr-danger', 2500);
                modal.show(self, answer.error, isShowProp, textProp);
            } else table.removeRowClassPause(tr, 'tr-edit', 1000);
        })
        .catch((err) => {
            table.toggleRowClass(tr, 'tr-danger', 'tr-edit');
            table.removeRowClassPause(tr, 'tr-danger', 2500);
            console.log(err);
        });
}