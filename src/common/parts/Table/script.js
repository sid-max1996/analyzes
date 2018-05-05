const table = require('../../../front_modules/jq/table');
import ModalBox from '../../../common/ModalBox.vue'

export default {
    data() {
        return {
            remIds: [],
            isCheckAll: false,
            isShowModal: false,
            btnText: 'Да',
            modalTitle: 'Подтверждение',
            modalText: 'Вы уверены что хотите выполнить удаление?'
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
                    idList: [],
                    curCount: 0,
                    addLink: ''
                }
            }
        }
    },
    computed: {
        countList: {
            get: function() {
                return this.params.countList;
            }
        },
        idList: {
            get: function() {
                return this.params.idList;
            }
        },
        curCount: {
            get: function() {
                return this.params.curCount;
            }
        },
        addLink: {
            get: function() {
                return this.params.addLink;
            }
        }
    },
    methods: {
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
                newRow[prop] = val.trim();
            });
            this.$emit('editEvent', newRow, id);
        },
        removeClick: function() {
            let table = $(this.$refs.table);
            let remCheckArr = table.find('input:checkbox:checked.check-remove');
            remCheckArr.each((ind, item) => {
                item.checked = false;
                let check = $(item);
                let td = $(check.parent()[0]);
                let tr = $(td.parent()[0]);
                let id = tr.attr('data-id');
                this.remIds.push(id);
            });
            if (this.remIds.length != 0)
                this.isShowModal = true;
        },
        toggleAll: function() {
            let table = $(this.$refs.table);
            let remCheckArr = table.find('input:checkbox.check-remove');
            remCheckArr.each((ind, check) => {
                check.checked = !(this.isCheckAll);
            });
            this.isCheckAll = !this.isCheckAll;
        },
        clearClick: function($event) {
            let target = $(event.target);
            let th = $(target.parent()[0]);
            table.clearColValue(th);
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
        refreshClick: function(event) {
            let target = $(event.target);
            let th = $(target.parent()[0]);
            let tr = $(th.parent()[0]);
            let filters = tr.find("th.filter");
            let filterRow = {};
            filters.each((ind, col) => {
                let val = table.getColValue(col);
                let prop = this.info[ind].colName;
                filterRow[prop] = val.trim();
            });
            this.$emit('filterEvent', filterRow);
        },
        rowChange: function(event) {
            let target = $(event.target);
            let option = target.find('option:selected')[0];
            let value = $(option).attr('value');
            this.$emit('countEvent', Number(value));
        },
        modalClose: function() {
            this.isShowModal = false;
        },
        removeConfirm: function() {
            this.$emit('removeEvent', this.remIds);
            this.remIds = [];
            this.isShowModal = false;
        }
    }
}