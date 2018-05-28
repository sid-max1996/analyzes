const front = require('../../../../../core/front');
const lib = require('../../../../../core/lib');
const info = front.serv.info;
const auth = front.serv.auth;
const cabinet = front.serv.cabinet;
const objArr = lib.meta.objArr;
const array = lib.meta.array;
const object = lib.meta.object;
const modal = front.comp.modal;
const table = front.comp.table;
const check = lib.valid.check;

import Pagination from '../../../../../core/front/modules/comp/Pagination/main.vue'
import ModalBox from '../../../../../core/front/modules/comp/ModalBox/main.vue'
import Table from '../../../../../core/front/modules/comp/Table/main.vue'

export default {
    data() {
        return {
            commInd: 3,
            src: '/cabinet/admin',
            lastFilter: {},
            rowCount: 0,
            tableParamsObj: {
                countList: [1, 5, 10],
                opBtn: { name: 'filter', class: 'fa fa-refresh refresh' },
                btns: [
                    { name: 'add', class: 'fas fa-user-plus add', type: 'link', link: '/cabinet/addUser' },
                    { name: 'remove', class: 'fas fa-trash-o remove', type: 'btn', confirm: true, ret: ['ids'] }
                ]
            },
            tableInfo: [
                { colName: 'userId', colTitle: 'id', colType: 'text', sort: true },
                { colName: 'userName', colTitle: 'имя', colType: 'input', sort: true },
                { colName: 'roleId', colTitle: 'роль', colType: 'select', sort: true },
                { colName: 'userEmail', colTitle: 'email', colType: 'input', sort: true }
            ],
            isShowModal: false,
            btnText: 'Закрыть',
            modalTitle: 'Ошибка',
            modalText: ''
        };
    },
    created: function() {
        this.rowCount = this.$store.state.default.rowCount;
        info.getRoleInfo()
            .then(data => Promise.resolve(
                objArr.freshProps(data, ['val', 'id'], ['roleName', 'roleId'])))
            .then(options => {
                this.tableInfo[2].options = options;
                this.tableInfo = array.clone(this.tableInfo);
            })
            .catch(err => console.log(err));
    },
    components: {
        'Pagination': Pagination,
        'ModalBox': ModalBox,
        'Table': Table
    },
    computed: {
        users: function() {
            if (!this.$store.state.adminInfo) return [];
            if (this.$store.state.adminInfo.success === false)
                modal.show(this, this.$store.state.adminInfo.error, 'isShowModal', 'modalText');
            let data = this.$store.state.adminInfo.data;
            let idList = objArr.intoArray(data, 'userId');
            let props = ['userId', 'userName', 'roleId', 'userEmail'];
            let twoArr = check.notNull(data) ? objArr.intoPropsArrList(data, props) : [];
            let res = [];
            for (let i = 0; i < twoArr.length; i++) {
                let cur = twoArr[i];
                let row = [{ text: cur[0] }, { text: cur[1] }, { op: cur[2] }, { text: cur[3] }];
                res.push(lib.meta.object.create(['id', 'row'], [idList[i], row]));
            }
            return res;
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
            this.tableParamsObj.rowCount = this.rowCount;
            this.tableParamsObj = object.clone(this.tableParamsObj);
            return this.tableParamsObj;
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
        sortChange: function(order, dir) {
            this.lastFilter.order = order;
            this.lastFilter.dir = dir;
            this.changeData({ pageNum: this.curPage, rowCount: this.rowCount, filter: this.lastFilter });
        },
        editRow: function(rowObj) {
            let tableElem = this.$refs.tableComp.$refs.table;
            let newRow = {
                userId: object.getProp(rowObj.row.userId, 'text'),
                roleId: object.getProp(rowObj.row.roleId, 'op'),
                userName: object.getProp(rowObj.row.userName, 'text'),
                userEmail: object.getProp(rowObj.row.userEmail, 'text')
            };
            table.doEdit(this, cabinet.updateUser, tableElem, rowObj.id, newRow, 'isShowModal', 'modalText');
        },
        modalClose: function() {
            modal.hide(this, 'isShowModal', 'modalText');
        },
        removeItems: function(idList) {
            let tableElem = this.$refs.tableComp.$refs.table;
            table.doRemove(this, cabinet.removeUsers, tableElem, idList, 'isShowModal', 'modalText');
        }
    }
}