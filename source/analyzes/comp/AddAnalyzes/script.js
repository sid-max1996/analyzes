const front = require('../../../../core/front');
const info = front.serv.info;
const auth = front.serv.auth;
const anal = front.serv.anal;
const modal = front.comp.modal;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;
const table = front.comp.table;

import ModalBox from '../../../../core/front/modules/comp/ModalBox/main.vue'
import Table from '../../../../core/front/modules/comp/Table/main.vue'

export default {
    data() {
        return {
            tableData: [],
            tableParams: {
                opBtn: { name: 'add', class: 'fa fa-plus plus' },
                btns: [
                    { name: 'save', class: 'fas fa-save save', type: 'btn', confirm: true, ret: ['ids', 'rows'] },
                    { name: 'remove', class: 'fas fa-trash-o remove', type: 'btn', confirm: true, ret: ['ids'] }
                ]
            },
            isShowModal: false,
            btnText: 'Закрыть',
            modalTitle: 'Ошибка',
            modalText: '',
        };
    },
    components: {
        'ModalBox': ModalBox,
        'Table': Table
    },
    computed: {
        tableInfo: function() {
            console.log('tableInfo component!!!!!!!!!!!!!!!1');
            console.log(this.$store.state);
            let groupInfo = this.$store.state.groupInfo;
            if (check.isUnd(groupInfo)) return [];
            console.log('groupInfo');
            console.log(groupInfo);
            if (check.isEmptyObj(groupInfo) || check.isUnd(groupInfo.success)) return [];
            if (groupInfo.success === false) {
                console.log('tableInfo modal box');
                modal.show(this, groupInfo.error, 'isShowModal', 'modalText');
            }
            console.log('tableInfo 1');
            let resArr = [];
            if (check.isUnd(groupInfo.analyzes)) return [];
            groupInfo.analyzes.forEach(el => {
                resArr.push(object.create(['colName', 'colTitle', 'colType', 'options'], ['anal-' + el.id, el.name, 'select', el.options]));
            });
            if (check.isUnd(groupInfo.anketa)) return [];
            groupInfo.anketa.choose.forEach(el => {
                resArr.push(object.create(['colName', 'colTitle', 'colType', 'options'], ['ank-' + el.id, el.name, 'select', el.options]));
            });
            groupInfo.anketa.text.forEach(el => {
                resArr.push(object.create(['colName', 'colTitle', 'colType'], ['ank-' + el.id, el.name, 'textarea']));
            });
            groupInfo.anketa.chooseText.forEach(el => {
                resArr.push(object.create(['colName', 'colTitle', 'colType', 'options'], ['ank-' + el.id, el.name, 'select-textarea', el.options]));
            });
            groupInfo.anketa.multChoose.forEach(el => {
                resArr.push(object.create(['colName', 'colTitle', 'colType', 'options'], ['ank-' + el.id, el.name, 'mult-select', el.options]));
            });
            console.log('info');
            console.log(resArr);
            return resArr;
        }
    },
    methods: {
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        addItem: function(addRow) {
            console.log('add event');
            console.log(addRow);
            let row = [];
            for (let key in addRow) {
                let val = addRow[key];
                if ('op' in val && 'text' in val) row.push({ op: val.op, text: val.text });
                else if ('op' in val) row.push({ op: val.op });
                else if ('text' in val) row.push({ text: val.text });
                else if ('ops' in val) row.push({ ops: val.ops });
            }
            console.log('row');
            console.log(row);
            this.tableData.push({ id: this.tableData.length, row: row });
        },
        editRow: function(rowObj) {
            console.log('edit event');
            console.log(this.tableData[rowObj.id]);
            console.log(rowObj.id);
            console.log(rowObj.row);
            let row = [];
            let edRow = rowObj.row;
            for (let key in edRow) {
                let val = edRow[key];
                if ('op' in val && 'text' in val) row.push({ op: val.op, text: val.text });
                else if ('op' in val) row.push({ op: val.op });
                else if ('text' in val) row.push({ text: val.text });
                else if ('ops' in val) row.push({ ops: val.ops });
            }
            this.tableData[rowObj.id].row = row;
            console.log(this.tableData[rowObj.id]);
        },
        removeItems: function(idList) {
            console.log('remove event');
            console.log(idList);
            let newData = [];
            let count = 0;
            for (let i = 0; i < this.tableData.length; i++) {
                let flag = true;
                for (let j = 0; j < idList.length; j++)
                    if (i === Number(idList[j])) flag = false;
                if (flag) {
                    newData.push({ id: count, row: this.tableData[i].row });
                    count += 1;
                }
            }
            console.log(newData);
            this.tableData = newData;
        },
        saveItems: function(idList, rows) {
            console.log('save event');
            console.log(rows);
            auth.nextAccess()
                .then(() => Promise.resolve({ rows: rows, groupId: this.$store.state.curGroup.id }))
                .then(anal.saveAnalyzes)
                .then((answer) => {
                    console.log("saveItems answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else this.removeItems(idList);
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        }
    }
}