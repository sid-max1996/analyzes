const front = require('../../../../core/front');
const auth = front.serv.auth;
const anal = front.serv.anal;
const info = front.serv.info;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const objArr = coreLib.meta.objArr;
const check = coreLib.valid.check;
const modal = front.comp.modal;


import ModalBox from '../../../../core/front/modules/comp/ModalBox/main.vue'
import List from '../../../../core/front/modules/comp/List/main.vue'
import Pagination from '../../../../core/front/modules/comp/Pagination/main.vue'

export default {
    data() {
        return {
            commInd: 4,
            isShowModal: false,
            btnText: 'Ok',
            modalTitle: '',
            modalText: '',
            confirmFun: () => {},
            confirmParams: null,
            newGroupName: '',
            manTitles: ['менеджер', ''],
            manBtns: [{ title: 'добавить', class: "btn-class", event: "addManager" }],
            manCurPage: 1,
            colTitles: ['сборщик', ''],
            colBtns: [{ title: 'добавить', class: "btn-class", event: "addCollector" }],
            colCurPage: 1,
            analTitles: ['анализ', ''],
            analBtns: [{ title: 'добавить', class: "btn-class", event: "addAnalyze" }],
            analCurPage: 1,
            ankTitles: ['вопрос', ''],
            ankBtns: [{ title: 'добавить', class: "btn-class", event: "addAnketa" }],
            ankCurPage: 1
        };
    },
    computed: {
        rowCount: function() {
            return this.$store.state.default.rowCount;
        },
        groupSettings: function() {
            let groupSettings = this.$store.state.groupSettings;
            return groupSettings ? groupSettings : null;
        },
        addGroupData: function() {
            let addGroupData = this.$store.state.addGroupData;
            return addGroupData ? addGroupData : null;
        },
        isCreator: function() {
            let groupSettings = this.groupSettings;
            return groupSettings ? groupSettings.isCreator : false;
        },
        isManager: function() {
            let groupSettings = this.groupSettings;
            return groupSettings ? groupSettings.isManager : false;
        },
        groupName: {
            get: function() {
                let groupSettings = this.groupSettings;
                return groupSettings ? groupSettings.groupName : '';
            },
            set: function(val) { this.newGroupName = val; }
        },
        curGroup: function() {
            return this.$store.state.curGroup;
        },
        manData: function() {
            let managers = this.addGroupData.managers;
            managers = managers ? managers : [];
            return objArr.intoPropsArrList(managers, ['userName']);
        },
        managers: function() {
            let managers = this.groupSettings.managers;
            return managers ? managers : [];
        },
        manAllCount: function() {
            let groupData = this.addGroupData;
            return groupData ? groupData.manCount : 0;
        },
        colData: function() {
            let collectors = this.addGroupData.collectors;
            collectors = collectors ? collectors : [];
            return objArr.intoPropsArrList(collectors, ['userName']);
        },
        collectors: function() {
            let collectors = this.groupSettings.collectors;
            return collectors ? collectors : [];
        },
        colAllCount: function() {
            let groupData = this.$store.state.addGroupData;
            return groupData ? groupData.colCount : 0;
        },
        analData: function() {
            let analData = this.addGroupData.analyzes;
            analData = analData ? analData : [];
            return objArr.intoPropsArrList(analData, ['name']);
        },
        ankData: function() {
            let ankData = this.addGroupData.anketa;
            ankData = ankData ? ankData : [];
            return objArr.intoPropsArrList(ankData, ['question']);
        },
        analAllCount: function() {
            let groupData = this.addGroupData;
            return groupData ? groupData.analCount : 0;
        },
        ankAllCount: function() {
            let groupData = this.addGroupData;
            return groupData ? groupData.ankCount : 0;
        },
        anketa: function() {
            let anketa = this.groupSettings.anketa;
            return anketa ? anketa : [];
        },
        analyzes: function() {
            let analyzes = this.groupSettings.analyzes;
            return analyzes ? analyzes : [];
        }
    },
    components: {
        'ModalBox': ModalBox,
        'List': List,
        'Pagination': Pagination
    },
    methods: {
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        manPageChange: function(value) {
            console.log('manPageChange ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isMan: true });
            this.manCurPage = value;
        },
        colPageChange: function(value) {
            console.log('colPageChange ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isColl: true });
            this.colCurPage = value;
        },
        modalClose: function() {
            this.confirmFun = () => {};
            modal.hide(this, 'isShowModal', 'modalText');
        },
        modalConfirm: function() {
            modal.hide(this, 'isShowModal', 'modalText');
            this.confirmFun(this.confirmParams);
            this.confirmFun = () => {};
        },
        removeGroupModal: function() {
            this.confirmFun = this.removeGroup;
            modal.show(this, 'Вы уверены, что хотите удалить группу?', 'isShowModal', 'modalText');
        },
        removeGroup: function() {
            console.log('removeGroup');
            auth.nextAccess()
                .then(() => anal.removeGroup(this.curGroup ? this.curGroup.id : null))
                .then((answer) => {
                    if (answer.success === false) {
                        this.confirmFun = () => {};
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else {
                        info.setSession('workGroup', null)
                            .then(answer => {
                                this.$store.state.curGroup = null;
                                window.location.replace(front.lib.ajax.SERVER_ADDRESS + 'analyzes/group/1');
                            })
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        changeGroupNameModal: function() {
            console.log(this.newGroupName);
            if (this.newGroupName === '') {
                this.confirmFun = () => {};
                modal.show(this, 'Не было изменений или пустое название', 'isShowModal', 'modalText');
            } else {
                this.confirmFun = this.changeGroupName;
                modal.show(this, 'Вы уверены, что хотите изменить название группы?', 'isShowModal', 'modalText');
            }
        },
        changeGroupName: function() {
            console.log('changeGroupName');
            auth.nextAccess()
                .then(() => anal.changeGroupName({ groupId: this.curGroup.id, groupName: this.newGroupName }))
                .then((answer) => {
                    if (answer.success === false) {
                        this.confirmFun = () => {};
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    } else {
                        let newGroup = { id: this.$store.state.curGroup.id, name: this.newGroupName };
                        info.setSession('workGroup', newGroup)
                            .then(data => window.location.reload())
                            .catch(err => modal.show(this, 'ошибка, перезагрузите страницу', 'isShowModal', 'modalText'));
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        addMember: function(member, afterFun) {
            let params = { groupId: this.curGroup.id, userId: member.userId };
            console.log(params);
            auth.nextAccess()
                .then(() => anal.addGroupMember(params))
                .then((answer) => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        afterFun(member);
                        modal.show(this, 'пользователь был добавлен в группу', 'isShowModal', 'modalText');
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        removeMember: function(ind, member, afterFun) {
            let params = { groupId: this.curGroup.id, userId: member.userId };
            auth.nextAccess()
                .then(() => anal.removeGroupMember(params))
                .then((answer) => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        afterFun(ind);
                        modal.show(this, 'пользователь был удалён из группы', 'isShowModal', 'modalText');
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        addManager: function(ind) {
            console.log('addManager: ' + ind);
            let member = this.addGroupData.managers[ind];
            let afterFun = (member) => { this.managers.push(member) };
            this.addMember(member, afterFun);
        },
        addCollector: function(ind) {
            console.log('addCollector: ' + ind);
            let member = this.addGroupData.collectors[ind];
            let afterFun = (member) => { this.collectors.push(member) };
            this.addMember(member, afterFun);
        },
        removeManager: function(ind) {
            console.log('removeManager: ' + ind);
            let member = this.managers[ind];
            let afterFun = (ind) => { this.managers.splice(ind, 1) };
            this.removeMember(ind, member, afterFun);
        },
        removeCollector: function(ind) {
            console.log('removeCollector: ' + ind);
            let member = this.collectors[ind];
            let afterFun = (ind) => { this.collectors.splice(ind, 1) };
            this.removeMember(ind, member, afterFun);
        },
        addColl: function(col, beforeFun, params, afterFun) {
            auth.nextAccess()
                .then(() => beforeFun(params))
                .then((answer) => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        afterFun(col);
                        modal.show(this, 'столбец был добавлен в группу', 'isShowModal', 'modalText');
                        this.$emit('changeData', 5);
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        removeColl: function(ind, beforeFun, params, afterFun) {
            auth.nextAccess()
                .then(() => beforeFun(params))
                .then((answer) => {
                    if (answer.success === false)
                        modal.show(this, answer.error, 'isShowModal', 'modalText');
                    else {
                        afterFun(ind);
                        modal.show(this, 'столбец был удалён из группы', 'isShowModal', 'modalText');
                        this.$emit('changeData', 5);
                    }
                })
                .catch(err => modal.show(this, 'Фатальная ошибка', 'isShowModal', 'modalText'))
        },
        addAnalyzeModal: function(ind) {
            this.confirmFun = this.addAnalyze;
            this.confirmParams = ind;
            modal.show(this, 'Вы уверены, что хотите добавить новый столбец?', 'isShowModal', 'modalText');
        },
        addAnalyze: function(ind) {
            console.log('addAnalyze: ' + ind);
            let col = this.addGroupData.analyzes[ind];
            let afterFun = (col) => { this.analyzes.push(col) };
            let beforeFun = anal.addGroupAnalyze;
            let params = { groupId: this.curGroup.id, analId: col.analId };
            this.addColl(col, beforeFun, params, afterFun);
        },
        addAnketaModal: function(ind) {
            this.confirmFun = this.addAnketa;
            this.confirmParams = ind;
            modal.show(this, 'Вы уверены, что хотите добавить новый столбец?', 'isShowModal', 'modalText');
        },
        addAnketa: function(ind) {
            console.log('addAnketa: ' + ind);
            let col = this.addGroupData.anketa[ind];
            let afterFun = (col) => { this.anketa.push(col) };
            let beforeFun = anal.addGroupAnketa;
            let params = { groupId: this.curGroup.id, ankId: col.ankId };
            this.addColl(col, beforeFun, params, afterFun);
        },
        removeAnalyzeModal: function(ind) {
            this.confirmFun = this.removeAnalyze;
            this.confirmParams = ind;
            modal.show(this, 'Вы уверены, что хотите удалить столбец вместе со всеми данными?', 'isShowModal', 'modalText');
        },
        removeAnalyze: function(ind) {
            console.log('removeAnalyze ' + ind);
            let col = this.analyzes[ind];
            console.log(col);
            let afterFun = (ind) => { this.analyzes.splice(ind, 1) };
            let beforeFun = anal.removeGroupAnalyze;
            let params = { groupId: this.curGroup.id, analId: col.analId };
            this.removeColl(ind, beforeFun, params, afterFun);
        },
        removeAnketaModal: function(ind) {
            this.confirmFun = this.removeAnketa;
            this.confirmParams = ind;
            modal.show(this, 'Вы уверены, что хотите удалить столбец вместе со всеми данными?', 'isShowModal', 'modalText');
        },
        removeAnketa: function(ind) {
            let col = this.anketa[ind];
            let afterFun = (ind) => { this.anketa.splice(ind, 1) };
            let beforeFun = anal.removeGroupAnketa;
            let params = { groupId: this.curGroup.id, ankId: col.ankId };
            this.removeColl(ind, beforeFun, params, afterFun);
        },
        analPageChange: function(value) {
            console.log('analPageChange ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isAnal: true });
            this.analCurPage = value;
        },
        ankPageChange: function(value) {
            console.log('ankPageChange ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isAnk: true });
            this.ankCurPage = value;
        }
    }
}