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
//const data = front.meta.data;
//const fetch = require('../../modules/fetch');

import Pagination from '../../../../core/front/modules/comp/Pagination/main.vue'
import ModalBox from '../../../../core/front/modules/comp/ModalBox/main.vue'
import Table from '../../../../core/front/modules/comp/Table/main.vue'

export default {
    data() {
        return {
            commInd: 1,
            src: '/analyzes/page',
            addLink: '/analyzes/add',
            lastFilter: {},
            rowCount: 0,
            tableParamsObj: {
                countList: [5, 10, 15, 25, 50, 100],
                opBtn: { name: 'filter', class: 'fa fa-refresh refresh' },
                btns: [
                    { name: 'add', class: 'fas fa-user-plus add', type: 'link', link: '/analyzes/add' },
                    { name: 'remove', class: 'fas fa-trash-o remove', type: 'btn', confirm: true, ret: ['ids'] }
                ]
            },
            isShowModal: false,
            btnText: 'Закрыть',
            modalTitle: 'Ошибка',
            modalText: '',
            lastFilter: null
        };
    },
    created: function() {
        this.rowCount = this.$store.state.default.rowCount;
    },
    components: {
        'Pagination': Pagination,
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
        },
        tableData: function() {
            console.log('tableData component!!!!!!!!!!!!!!!1');
            console.log(this.$store.state);
            let analyzesData = this.$store.state.analyzesData;
            if (check.isUnd(analyzesData)) return [];
            let tableInfo = this.tableInfo;
            console.log('tableData analyzesData');
            console.log(analyzesData);
            console.log('tableData tableInfo');
            console.log(tableInfo);
            if (check.isEmptyObj(analyzesData) || check.isUnd(analyzesData.success)) return [];
            if (check.size(tableInfo, 0)) return [];
            if (analyzesData.success === false) {
                modal.show(this, analyzesData.error, 'isShowModal', 'modalText');
                return [];
            }
            if (analyzesData.mainIds.length === 0 && this.curPage !== 1) {
                window.location.replace(front.lib.ajax.SERVER_ADDRESS + 'analyzes/page/1');
                return [];
            }
            console.log('tableData 1');
            let res = [];
            let analyzes = analyzesData.analyzes;
            let anketa = analyzesData.anketa;
            let extra = analyzesData.extra;
            let mult = analyzesData.mult;
            let mainIds = analyzesData.mainIds;
            let len = mainIds ? mainIds.length : 0;
            for (let ind = 0; ind < len; ind++) {
                let row = [];
                let curAnal = analyzes[ind];
                let curAnk = anketa[ind];
                let curExtra = extra[ind];
                let curMult = mult[ind];
                tableInfo.forEach(col => {
                    let colId = col.colName;
                    let colType = col.colType;
                    if (colId.indexOf('anal') !== -1) {
                        let analId = Number(colId.replace('anal-', ''));
                        for (let i = 0; i < curAnal.length; i++) {
                            if (curAnal[i].id === analId) {
                                row.push({ op: curAnal[i].op });
                                break;
                            }
                        }
                    } else if (colId.indexOf('ank') !== -1) {
                        let ankId = Number(colId.replace('ank-', ''));
                        switch (colType) {
                            case 'select':
                                for (let i = 0; i < curAnk.length; i++) {
                                    if (curAnk[i].id === ankId) {
                                        row.push({ op: curAnk[i].op });
                                        break;
                                    }
                                }
                                break;
                            case 'textarea':
                                for (let i = 0; i < curExtra.length; i++) {
                                    if (curExtra[i].id === ankId) {
                                        row.push({ text: curExtra[i].text });
                                        break;
                                    }
                                }
                                break;
                            case 'select-textarea':
                                let obj = {};
                                for (let i = 0; i < curAnk.length; i++) {
                                    if (curAnk[i].id === ankId) {
                                        obj.op = curAnk[i].op;
                                        break;
                                    }
                                }
                                for (let i = 0; i < curExtra.length; i++) {
                                    if (curExtra[i].id === ankId) {
                                        obj.text = curExtra[i].text;
                                        break;
                                    }
                                }
                                row.push(obj);
                                break;
                            case 'mult-select':
                                let arr = [];
                                for (let i = 0; i < curMult.length; i++) {
                                    if (curMult[i].id === ankId) {
                                        arr.push(curMult[i].op);
                                    }
                                }
                                row.push({ ops: arr });
                                break;
                            default:
                                break;
                        }
                    }
                });
                let id = mainIds[ind];
                res.push(object.create(['id', 'row'], [id, row]));
            }
            console.log(analyzesData);
            console.log('data!!!!!!!!!!!!!!!!!!!!!!!!!!');
            console.log(res);
            return res;
        },
        tableParams: function() {
            this.tableParamsObj.rowCount = this.rowCount;
            this.tableParamsObj = object.clone(this.tableParamsObj);
            return this.tableParamsObj;
        },
        curPage: function() {
            return Number(this.$route.params.pageNum);
        },
        allCount: function() {
            return this.$store.state.analyzesData ? this.$store.state.analyzesData.count : 0;
        }
    },
    methods: {
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        pageChange: function(value) {
            console.log('pageChange chsnge = ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, filter: this.lastFilter });
        },
        rowChange: function(value) {
            console.log('row chsnge = ' + value);
            this.rowCount = value;
            this.changeData({ pageNum: this.curPage, rowCount: value });
        },
        filterChange: function(filter) {
            console.log('filter event');
            console.log(filter);
            this.lastFilter = filter;
            this.changeData({ pageNum: this.curPage, rowCount: this.rowCount, filter: filter });
        },
        editRow: function(rowObj) {
            console.log('edit event');
            console.log(rowObj.id);
            console.log(rowObj.row);
            let tableElem = this.$refs.tableComp.$refs.table;
            table.doEdit(this, anal.updateAnalyze, tableElem, rowObj.id, rowObj.row, 'isShowModal', 'modalText');
        },
        removeItems: function(idList) {
            console.log('remove event');
            console.log(idList);
            let tableElem = this.$refs.tableComp.$refs.table;
            table.doRemove(this, anal.removeAnalyzes, tableElem, idList, 'isShowModal', 'modalText', { idList: idList, groupId: this.$store.state.curGroup.id });
        }
    }
}