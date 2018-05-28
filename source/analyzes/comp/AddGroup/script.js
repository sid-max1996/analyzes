const front = require('../../../../core/front');
const auth = front.serv.auth;
const anal = front.serv.anal;
const info = front.serv.info;
const coreLib = require('../../../../core/lib');
const array = coreLib.meta.array;
const object = coreLib.meta.object;
const alert = front.comp.alert;
const objArr = coreLib.meta.objArr;

import Alert from '../../../../core/front/modules/comp/Alert/main.vue'
import List from '../../../../core/front/modules/comp/List/main.vue'
import Pagination from '../../../../core/front/modules/comp/Pagination/main.vue'

export default {
    data() {
        return {
            commInd: 4,
            isAlert: false,
            alertText: null,
            alertInfo: null,
            groupName: null,
            titles1: ['менеджер', ''],
            btns1: [{ title: 'добавить', class: "btn-class", event: "addManager" }],
            titles2: ['сборщик', ''],
            btns2: [{ title: 'добавить', class: "btn-class", event: "addCollector" }],
            managers: [],
            collectors: [],
            membIdsSet: new Set(),
            curPage1: 1,
            curPage2: 1,
            analTitles: ['анализ', ''],
            analBtns: [{ title: 'добавить', class: "btn-class", event: "addAnalyze" }],
            analIdsSet: new Set(),
            analyzes: [],
            analCurPage: 1,
            ankTitles: ['вопрос', ''],
            ankBtns: [{ title: 'добавить', class: "btn-class", event: "addAnketa" }],
            ankIdsSet: new Set(),
            anketa: [],
            ankCurPage: 1,
        };
    },
    components: {
        'Alert': Alert,
        'List': List,
        'Pagination': Pagination
    },
    computed: {
        members: function() {
            let groupData = this.$store.state.addGroupData;
            let managers = groupData.managers;
            let collectors = groupData.collectors;
            return object.create(['managers', 'collectors'], [managers, collectors]);
        },
        cols: function() {
            let groupData = this.$store.state.addGroupData;
            let analyzes = groupData.analyzes;
            let anketa = groupData.anketa;
            return object.create(['analyzes', 'anketa'], [analyzes, anketa]);
        },
        data1: function() {
            let managers = this.$store.state.addGroupData.managers;
            managers = managers ? managers : [];
            return objArr.intoPropsArrList(managers, ['userName']);
        },
        data2: function() {
            let collectors = this.$store.state.addGroupData.collectors;
            collectors = collectors ? collectors : [];
            return objArr.intoPropsArrList(collectors, ['userName']);
        },
        analData: function() {
            let analData = this.$store.state.addGroupData.analyzes;
            analData = analData ? analData : [];
            return objArr.intoPropsArrList(analData, ['name']);
        },
        ankData: function() {
            let ankData = this.$store.state.addGroupData.anketa;
            ankData = ankData ? ankData : [];
            return objArr.intoPropsArrList(ankData, ['question']);
        },
        rowCount: function() {
            return this.$store.state.default.rowCount;
        },
        allCount1: function() {
            let groupData = this.$store.state.addGroupData;
            return groupData ? groupData.manCount : 0;
        },
        allCount2: function() {
            let groupData = this.$store.state.addGroupData;
            return groupData ? groupData.colCount : 0;
        },
        analAllCount: function() {
            let groupData = this.$store.state.addGroupData;
            return groupData ? groupData.analCount : 0;
        },
        ankAllCount: function() {
            let groupData = this.$store.state.addGroupData;
            return groupData ? groupData.ankCount : 0;
        }
    },
    methods: {
        addGroup: function() {
            let self = this;
            auth.nextAccess()
                .then(() => Promise.resolve({
                    groupName: self.groupName,
                    membersIds: array.merge(objArr.intoPropArrayList(this.managers, 'userId'),
                        objArr.intoPropArrayList(this.collectors, 'userId')),
                    analIds: objArr.intoPropArrayList(this.analyzes, 'analId'),
                    ankIds: objArr.intoPropArrayList(this.anketa, 'ankId')
                }))
                .then(anal.addGroup)
                .then(answer => {
                    alert.showToggle(answer.success, self, answer.error, 'группа добавлена',
                        'alertInfo', 'alertText', 'isAlert');
                    if (answer.success) {
                        this.groupName = '';
                        this.managers = [];
                        this.collectors = [];
                        this.membIdsSet.clear();
                    }
                })
                .catch((err) => {
                    alert.showError(true, self, 'непредвиденная ошибка', 'alertInfo', 'alertText', 'isAlert');
                    console.log(err);
                });
        },
        addManager: function(ind) {
            console.log('addManager: ' + ind);
            let member = this.members.managers[ind];
            if (!this.membIdsSet.has(member.userId)) {
                this.managers.push(member);
                this.membIdsSet.add(member.userId);
            }
        },
        addCollector: function(ind) {
            console.log('addCollector: ' + ind);
            let member = this.members.collectors[ind];
            if (!this.membIdsSet.has(member.userId)) {
                this.collectors.push(member);
                this.membIdsSet.add(member.userId);
            }
        },
        addAnalyze: function(ind) {
            console.log('addAnalyze: ' + ind);
            let col = this.cols.analyzes[ind];
            if (!this.analIdsSet.has(col.analId)) {
                this.analyzes.push(col);
                this.analIdsSet.add(col.analId);
            }
        },
        addAnketa: function(ind) {
            console.log('addAnketa: ' + ind);
            let col = this.cols.anketa[ind];
            if (!this.ankIdsSet.has(col.ankId)) {
                this.anketa.push(col);
                this.ankIdsSet.add(col.ankId);
            }
        },
        removeManager: function(ind) {
            let member = this.managers[ind];
            this.membIdsSet.delete(member.userId);
            this.managers.splice(ind, 1);
        },
        removeCollector: function(ind) {
            let member = this.collectors[ind];
            this.membIdsSet.delete(member.userId);
            this.collectors.splice(ind, 1);
        },
        removeAnalyze: function(ind) {
            let col = this.analyzes[ind];
            this.analIdsSet.delete(col.analId);
            this.analyzes.splice(ind, 1);
        },
        removeAnketa: function(ind) {
            let col = this.anketa[ind];
            this.ankIdsSet.delete(col.ankId);
            this.anketa.splice(ind, 1);
        },
        changeData: function(params) {
            this.$emit('changeData', this.commInd, params);
        },
        pageChange1: function(value) {
            console.log('pageChange1 ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isMan: true });
            this.curPage1 = value;
        },
        pageChange2: function(value) {
            console.log('pageChange2 ' + value);
            this.changeData({ pageNum: value, rowCount: this.rowCount, isColl: true });
            this.curPage2 = value;
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