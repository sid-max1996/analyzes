const table = require('../../jq').table;
const meta = require('../../../../lib').meta;
const modif = require('../../../../lib').modif;
import ModalBox from '../ModalBox/main'

export default {
    data() {
        return {
            sendIds: [],
            isCheckAll: false,
            isShowModal: false,
            btnText: 'Да',
            modalTitle: 'Подтверждение',
            modalText: 'Вы уверены что хотите выполнить это действие?',
            btn: null
        };
    },
    components: {
        'ModalBox': ModalBox
    },
    props: {
        info: {
            type: Array,
            default: function() { return [] }
        },
        data: {
            type: Array,
            default: function() { return [] }
        },
        params: {
            default: function() {
                return {
                    countList: [],
                    curCount: 0,
                    opBtn: null,
                    btns: [],
                    isEmptyOp: false
                }
            }
        }
    },
    computed: {
        countList: function() {
            return this.params.countList;
        },
        curCount: function() {
            return this.params.rowCount;
        },
        btns: function() {
            return this.params.btns;
        },
        opBtn: function() {
            return this.params.opBtn;
        }
    },
    methods: {
        getBtnReturn: function(rets, ids) {
            let res = [];
            rets.forEach(ret => {
                if (ret === 'ids') res.push(ids);
                else if (ret === 'rows') res.push(this.getRowsByDataIds(ids));
                else if (ret === 'rowsObj') res.push(this.getRowsByDataIds(ids, true));
                else res.push(null);
            });
            return res;
        },
        getRowsByDataIds: function(ids, isRowObj = false) {
            console.log('getRowsByDataIds');
            let res = [];
            ids.forEach(id => {
                let tr = $(this.$refs.table).find(`tr[data-id=${id}]`);
                let cols = tr.find("td.col");
                let row = {};
                cols.each((ind, col) => {
                    let val = table.getColValue(col);
                    let prop = this.info[ind].colName;
                    row[prop] = modif.transform(val, [modif.filters.trim, modif.filters.objTrim]);
                });
                if (isRowObj) res.push({ id: id, row: row });
                else res.push(row);
            });
            return res;
        },
        editClick: function(event) {
            let target = $(event.target);
            let td = $(target.parent()[0]);
            let tr = $(td.parent()[0]);
            let id = tr.attr('data-id');
            let cols = tr.find("td.col");
            let newRow = {};
            cols.each((ind, col) => {
                let val = table.getColValue(col);
                let prop = this.info[ind].colName;
                newRow[prop] = modif.transform(val, [modif.filters.trim, modif.filters.objTrim]);
            });
            this.$emit('editEvent', { id: id, row: newRow });
        },
        btnClick: function(ind) {
            let btn = this.btns[ind];
            console.log(btn);
            let btnName = btn.name;
            let ret = btn.ret;
            let table = $(this.$refs.table);
            let selCheckArr = table.find('input:checkbox:checked.check-sel');
            selCheckArr.each((ind, item) => {
                item.checked = false;
                let check = $(item);
                let td = $(check.parent()[0]);
                let tr = $(td.parent()[0]);
                let id = tr.attr('data-id');
                this.sendIds.push(id);
            });
            if (meta.object.isVal(btn, 'confirm', true) &&
                this.sendIds.length != 0) {
                this.btn = btn;
                this.isShowModal = true;
            } else {
                if (this.sendIds.length != 0) {
                    this.$emit(btnName + 'Event', ...this.getBtnReturn(ret, this.sendIds));
                    this.sendIds = [];
                }
            }
        },
        btnConfirm: function() {
            this.$emit(this.btn.name + 'Event', ...this.getBtnReturn(this.btn.ret, this.sendIds));
            this.sendIds = [];
            this.btn = null;
            this.isShowModal = false;
        },
        btnCancel: function() {
            this.sendIds = [];
            this.isShowModal = false;
        },
        toggleAll: function() {
            let table = $(this.$refs.table);
            let remCheckArr = table.find('input:checkbox.check-sel');
            remCheckArr.each((ind, check) => {
                check.checked = !(this.isCheckAll);
            });
            this.isCheckAll = !this.isCheckAll;
        },
        mainClearClick: function($event) {
            let target = $(event.target);
            let th = $(target.parent()[0]);
            let tr = $(th.parent()[0]);
            let filters = tr.find("th.filter");
            filters.each((ind, col) => {
                table.clearColValue(col);
            });
            this.$emit('filterEvent', {});
        },
        optionsClick: function(event, opBtnName) {
            let target = $(event.target);
            let th = $(target.parent()[0]);
            let tr = $(th.parent()[0]);
            let filters = tr.find("th.filter");
            let filterRow = {};
            filters.each((ind, col) => {
                let val = table.getColValue(col);
                let prop = this.info[ind].colName;
                filterRow[prop] = modif.transform(val, [modif.filters.trim, modif.filters.objTrim]);
            });
            this.$emit(opBtnName + 'Event', filterRow);
        },
        rowChange: function(event) {
            let target = $(event.target);
            let option = target.find('option:selected')[0];
            let value = $(option).attr('value');
            this.$emit('countEvent', Number(value));
        },
        sort: function(colName, dir) {
            this.$emit('sortEvent', colName, dir);
        },
        isInOps(ops, val) {
            for (let i = 0; i < ops.length; i++)
                if (Number(ops[i]) === Number(val)) return true;
            return false;
        }
    }
}