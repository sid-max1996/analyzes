const front = require('../../../../core/front');
const info = front.serv.info;
const auth = front.serv.auth;
const stat = front.serv.stat;
const modal = front.comp.modal;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;
const table = front.comp.table;

import ModalBox from '../../../../core/front/modules/comp/ModalBox/main.vue'
import Table from '../../../../core/front/modules/comp/Table/main.vue'
import Cols from '../../../../core/front/modules/comp/Cols/main.vue'

export default {
    data() {
        return {
            tableData: [],
            tableParams: { opBtn: { name: 'add', class: 'fa fa-plus plus' }, isEmptyOp: true },
            isShowModal: false,
            btnText: 'ок',
            modalTitle: 'Ошибка',
            modalText: '',
            colBtn: { class: 'btn-primary', event: 'colsClick', title: 'Рассчитать' },
            percentColsCalc: [],
            colAllCount: 0,
            filters: [],
            filtersCalc: [],
            filAllCount: 0,
            allelesColsCalc: [],
            curSel: null,
            xiSquereColsCalc: []
        };
    },
    components: {
        'ModalBox': ModalBox,
        'Table': Table,
        'Cols': Cols
    },
    computed: {
        tableInfo: function() {
            console.log('tableInfo component!!!!!!!!!!!!!!!1');
            console.log(this.$store.state);
            let groupInfo = this.$store.state.addRecordsInfo;
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
        },
        analInfo: function() {
            let statInfo = this.$store.state.statisticsInfo;
            if (statInfo && statInfo.analyzes) return statInfo.analyzes;
            else return [];
        },
        selections: function() {
            let statInfo = this.$store.state.statisticsInfo;
            if (statInfo && statInfo.selections) return statInfo.selections;
            else return [];
        }
    },
    methods: {
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        percentCols: function(cols) {
            console.log('percentCols');
            console.log(cols);
            auth.nextAccess()
                .then(() => stat.getPercentCols(this.$store.state.curSel.id, cols))
                .then((answer) => {
                    console.log("getPercentCols answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else {
                        this.colAllCount = answer.allCount;
                        this.percentColsCalc = answer.calc;
                    }
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        addFilter: function(filRow) {
            console.log('add filter');
            console.log(filRow);
            let row = [];
            for (let key in filRow) {
                let val = filRow[key];
                if ('op' in val && 'text' in val) row.push({ op: val.op, text: val.text });
                else if ('op' in val) row.push({ op: val.op });
                else if ('text' in val) row.push({ text: val.text });
                else if ('ops' in val) row.push({ ops: val.ops });
            }
            this.tableData.push({ id: this.tableData.length, row: row });
            this.filters.push(filRow);
        },
        clearFilters: function() {
            this.tableData = [];
            this.filters = [];
            this.filAllCount = 0;
        },
        calcFilters: function() {
            console.log('calcFilters');
            auth.nextAccess()
                .then(() => stat.getFiltersCalc(this.$store.state.curSel.id, this.filters))
                .then((answer) => {
                    console.log("getFiltersCalc answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else {
                        this.filAllCount = answer.allCount;
                        this.filtersCalc = answer.calc;
                    }
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        allelesCols: function(cols) {
            console.log('allelesCols');
            console.log(cols);
            auth.nextAccess()
                .then(() => stat.getAllelesCols(this.$store.state.curSel.id, cols))
                .then((answer) => {
                    console.log("getAllelesCols answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else this.allelesColsCalc = answer.calc;
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        xiSquereCols: function(cols) {
            console.log('xiSquereCols');
            console.log(cols);
            if (this.curSel) {
                auth.nextAccess()
                    .then(() => stat.getXiSquereCols(this.$store.state.curSel.id, this.curSel.id, cols))
                    .then((answer) => {
                        console.log("xiSquereCols answer");
                        console.log(answer);
                        if (answer.success === false) {
                            modal.show(this, answer.error, 'isShowModal', 'modalText');
                        } else this.xiSquereColsCalc = answer.calc;
                    })
                    .catch((err) => {
                        modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                        console.log(err)
                    });
            } else modal.show(this, 'Выберите 2ую выборку', 'isShowModal', 'modalText');
        }
    }
}