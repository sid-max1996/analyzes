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

export default {
    data() {
        return {
            tableParams: { opBtn: { name: 'add', class: 'fa fa-plus plus' } },
            isShowModal: false,
            btnText: 'ок',
            modalTitle: 'Ошибка',
            modalText: '',
            idList: [],
            selInfo: {},
            confirmFun: null
        };
    },
    components: {
        'ModalBox': ModalBox,
        'Table': Table
    },
    created: function() {
        info.getSession('workSel').then(data => {
            console.log('getSession');
            if (data.value) this.refreshSelInfo(data.value.id);
            else modal.show(this, 'не установлена текущая выборка', 'isShowModal', 'modalText');
        });
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
        }
    },
    methods: {
        refreshSelInfo: function(selId) {
            stat.getSelInfo(selId)
                .then(res => {
                    if (res.success === false) {
                        modal.show(this, res.error, 'isShowModal', 'modalText');
                    }
                    this.selInfo = res;
                })
                .catch(err => modal.show(this, 'не удалось получить данные с сервера', 'isShowModal', 'modalText'));
        },
        modalClose: function() {
            this.confirmFun = null;
            modal.hide(this, 'isShowModal', 'modalText');
        },
        getItems: function(filRow) {
            console.log('add event');
            console.log(filRow);
            auth.nextAccess()
                .then(() => Promise.resolve({ filter: filRow, selId: this.$store.state.curSel.id }))
                .then(stat.getSelItems)
                .then((answer) => {
                    console.log("addItem answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else {
                        console.log(answer.ids);
                        this.idList = answer.ids;
                    }
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        removeItems: function(idList) {
            console.log('remove event');
            auth.nextAccess()
                .then(() => Promise.resolve(this.$store.state.curSel.id))
                .then(stat.removeSelItems)
                .then((answer) => {
                    console.log("addItem answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else this.refreshSelInfo(this.$store.state.curSel.id);
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        pushItems: function() {
            console.log('push event');
            auth.nextAccess()
                .then(() => Promise.resolve({ ids: this.idList, selId: this.$store.state.curSel.id }))
                .then(stat.pushSelItems)
                .then((answer) => {
                    console.log("pushItems answer");
                    console.log(answer);
                    if (answer.success === false) {
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else this.refreshSelInfo(this.$store.state.curSel.id);
                })
                .catch((err) => {
                    modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText');
                    console.log(err)
                });
        },
        removeItemsConfirm: function() {
            this.confirmFun = this.removeItems;
            modal.show(this, 'подтвердить очистку выборки', 'isShowModal', 'modalText');
        },
        confirmBtn: function() {
            if (this.confirmFun) this.confirmFun();
            this.modalClose();
        }
    }
}