const front = require('../../../core/front');
const coreLib = require('../../../core/lib');
const methods = require('./source/methods');
const data = front.meta.data;
const main = front.comp.main;
const Command = main.Command;
const info = front.serv.info;
const object = coreLib.meta.object;
const check = coreLib.valid.check;

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
Vue.use(VueRouter)
Vue.use(Vuex)

import MainTemplate from '../../../core/front/modules/comp/MainTemplate/main.vue'
import ChangeSelection from '../comp/ChangeSelection/main.vue'
import AddSelection from '../comp/AddSelection/main.vue'
import PushRecords from '../comp/PushRecords/main.vue'
import Statistics from '../comp/Statistics/main.vue'

const store = new Vuex.Store(require('./source/store'));
const pathList = ['/statistics/selections/:pageNum', '/statistics/add/selection/:pageNum', '/statistics/push/records',
    '/statistics/calculation'
];

export default {
    data() {
        return {
            command: new Command(['fetchSelectionsData', 'fetchAddSelectionInfo',
                'fetchPushRecordsInfo', 'fetchStatisticsInfo'
            ]),
            roleId: 0,
            commandsList: [
                { path: pathList[0].replace(':pageNum', '1'), title: "Текущая выборка", roleId: 1 },
                { path: pathList[1].replace(':pageNum', '1'), title: "Создание выборки", roleId: 1 },
                { path: pathList[2], title: "Наполнение выборки", roleId: 1 },
                { path: pathList[3], title: "Расчёты", roleId: 1 }
            ],
            menuInfo: {}
        };
    },
    store,
    components: {
        'MainTemplate': MainTemplate
    },
    router: new VueRouter({
        mode: 'history',
        routes: [
            { path: pathList[0], component: ChangeSelection },
            { path: pathList[1], component: AddSelection },
            { path: pathList[2], component: PushRecords },
            { path: pathList[3], component: Statistics }
        ]
    }),
    created: function() {
        this.getWorkSel()
            .then(this.fetchData())
            .catch(err => console.log(err));
    },
    computed: {
        curSel: function() {
            return store.state.curSel ? store.state.curSel : {};
        }
    },
    methods: {
        getWorkSel: function() {
            info.getSession('workSel').then(data => {
                if (data) store.state.curSel = data.value;
                else store.state.curSel = {};
            });
            return Promise.resolve();
        },
        noFetchData: function() {
            return Promise.resolve();
        },
        fetchSelectionsData: function(params) {
            return data.fetchTable(store, 'setSelectionsData', methods.fetchSelectionsData, params);
        },
        fetchAddSelectionInfo: function(params) {
            return data.fetchTable(store, 'setAddSelectionInfo', methods.fetchAddSelectionInfo, params);
        },
        fetchPushRecordsInfo: function(params) {
            console.log(this.curSel.selId);
            if (this.curSel.id)
                return data.fetchStore(store, 'setAddRecordsInfo', methods.fetchAddRecordsInfo, this.curSel.id);
            else return Promise.resolve();
        },
        fetchStatisticsInfo: function(params) {
            console.log(this.curSel.selId);
            if (this.curSel.id)
                return data.fetchStore(store, 'setStatisticsInfo', methods.fetchStatisticsInfo, this.curSel.id);
            else return Promise.resolve();
        },
        fetchMainInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                main.getMainInfo()
                    .then((resObj) => {
                        self.menuInfo = { curItemInd: 1, isDarkScheme: resObj.menuInfo.isDarkScheme };
                        self.roleId = resObj.commandsInfo.roleId;
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchData: function() {
            this.fetchMainInfo()
                .then(() => Promise.resolve({ pageNum: this.$route.params.pageNum }))
                .then(this.fetchSelectionsData)
                .then(() => Promise.resolve({ pageNum: this.$route.params.pageNum }))
                .then(this.fetchAddSelectionInfo)
                .then(this.fetchPushRecordsInfo)
                .then(this.fetchStatisticsInfo)
                .then(() => console.log("success fetch data"))
                .catch((err) => console.log(err));
        },
        changeCommand: function(index) {
            console.log(index);
            Command.executeMethod(this, this.command, index)
                .then(data => {
                    console.log("data:");
                    console.log(data);
                    console.log("success fetch command data")
                })
                .catch((err) => console.log(err));
        },
        changeData: function(index, params) {
            console.log('changeData');
            console.log(index);
            console.log(params);
            Command.executeMethod(this, this.command, index, params)
                .then(data => {
                    console.log("data:");
                    console.log(data);
                    console.log("success change data");
                })
                .catch((err) => console.log(err));
        },
        executeMethod: function(method, params) {
            console.log('executeMethod');
            console.log(method);
            console.log(params);
            if (check.notNull(this[method])) this[method](params);
            else console.log('executeMethod: no method ' + method);
        }
    }
}