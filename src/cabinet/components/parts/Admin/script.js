const info = require('../../../../front_modules/service/info');
const auth = require('../../../../front_modules/service/auth');
const admin = require('../../../../front_modules/service/users/admin');
const front = require('../../../../front_modules/front');

import Pagination from '../../../../common/Pagination.vue'
import ModalBox from '../../../../common/ModalBox.vue'
import Table from '../../../../common/Table.vue'

export default {
    data() {
        return {
            commInd: 3,
            src: '/cabinet/admin',
            addLink: '/cabinet/addUser',
            lastFilter: {},
            rowCount: 0,
            idList: [],
            tableInfo: [
                { colTitle: 'id', colType: 'text', colName: 'userId', colMin: '150px', filType: 'input', filMax: '100px' },
                { colTitle: 'имя', colType: 'input', colName: 'userName', colMin: '300px', filType: 'input', filMax: 'auto' },
                { colTitle: 'роль', colType: 'select', colName: 'roleId', colMin: '300px', filType: 'select', filMax: '150px' },
                { colTitle: 'email', colType: 'input', colName: 'email', colMin: '300px', filType: 'input', filMax: 'auto' }
            ],
            tableObj: {
                countList: [1, 5, 10],
                addLink: '/cabinet/addUser'
            },
            isShowModal: false,
            btnText: 'Закрыть',
            modalTitle: 'Ошибка',
            modalText: ''
        };
    },
    created: function() {
        this.rowCount = this.$store.state.default.rowCount;
        info.getOptionsInfo('role')
            .then(options => this.tableInfo[2].options = options)
            .catch(err => console.log(err));
    },
    components: {
        'Pagination': Pagination,
        'ModalBox': ModalBox,
        'Table': Table
    },
    computed: {
        users: function() {
            if (this.$store.state.adminInfo.success === false)
                front.showModalBox(this, this.$store.state.adminInfo.error, 'isShowModal', 'modalText');
            let data = this.$store.state.adminInfo.data;
            let props = ['userId', 'userName', 'roleId', 'email'];
            front.setTableIdList(this, data, 'idList', 'userId');
            return front.tableData(data, props);
        },
        curPage: function() {
            return Number(this.$route.params.pageNum);
        },
        allCount: {
            get: function() {
                return this.$store.state.adminInfo.count;
            }
        },
        tableParams: function() {
            return front.tableParams(this.tableObj, this.rowCount, this.idList);
        }
    },
    methods: {
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        pageChange: function(value) {
            this.changeData({ pageNum: value, rowCount: this.rowCount, filter: this.lastFilter });
        },
        rowChange: function(value) {
            this.rowCount = value;
            this.changeData({ pageNum: this.curPage, rowCount: value });
        },
        filterChange: function(filter) {
            this.lastFilter = filter;
            this.changeData({ pageNum: this.curPage, rowCount: this.rowCount, filter: filter });
        },
        editRow: function(newRow, id) {
            let tableElem = this.$refs.tableComp.$refs.table;
            front.doTableEdit(this, admin.updateUser, tableElem, id, newRow, 'isShowModal', 'modalText');
        },
        modalClose: function() {
            front.hideModalBox(this, 'isShowModal', 'modalText');
        },
        removeItems: function(idList) {
            let tableElem = this.$refs.tableComp.$refs.table;
            front.doTableRemove(this, admin.removeUsers, tableElem, idList, 'isShowModal', 'modalText');
        }
    }
}