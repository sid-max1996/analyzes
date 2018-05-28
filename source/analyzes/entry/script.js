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
import ChangeGroups from '../comp/ChangeGroups/main.vue'
import GroupAnalyzes from '../comp/GroupAnalyzes/main.vue'
import AddGroup from '../comp/AddGroup/main.vue'
import AddAnalyzes from '../comp/AddAnalyzes/main.vue'
import GroupSettings from '../comp/GroupSettings/main.vue'
import GroupCols from '../comp/GroupCols/main.vue'
import GroupCol from '../comp/GroupCol/main.vue'

const store = new Vuex.Store(require('./source/store'));
const pathList = ['/analyzes/group/:pageNum', '/analyzes/page/:pageNum', '/analyzes/cols',
    '/analyzes/add/group', '/analyzes', '/analyzes/add', '/analyzes/col/:type/:id'
];

export default {
    data() {
        return {
            command: new Command(['fetchGroupsData', 'fetchAnalyzesData', 'fetchGroupSettings',
                'fetchColsData', 'fetchAddGroupData', 'fetchGroupInfo'
            ]),
            roleId: 0,
            commandsList: [
                { path: pathList[0].replace(':pageNum', '1'), title: "Выбор группы", roleId: 1 },
                { path: pathList[1].replace(':pageNum', '1'), title: "Анализы", roleId: 1 },
                { path: pathList[4], title: "Параметры группы", roleId: 2 },
                { path: pathList[2], title: "Управление столбцами", roleId: 2 },
                { path: pathList[3], title: "Добавить группу", roleId: 2 }
            ],
            menuInfo: {},
            isArrows: false
        };
    },
    store,
    components: {
        'MainTemplate': MainTemplate
    },
    router: new VueRouter({
        mode: 'history',
        routes: [
            { path: pathList[0], component: ChangeGroups },
            { path: pathList[1], component: GroupAnalyzes },
            { path: pathList[2], component: GroupCols },
            { path: pathList[3], component: AddGroup },
            { path: pathList[4], component: GroupSettings },
            { path: pathList[5], component: AddAnalyzes },
            { path: pathList[6], component: GroupCol }
        ]
    }),
    created: function() {
        if (this.$route.path.indexOf('analyzes/page') !== -1) this.isArrows = true;
        if (this.$route.path.indexOf('analyzes/add') !== -1) this.isArrows = true;
        console.log(this.$route.path);
        this.getWorkGroupId()
            .then(this.fetchData())
            .catch(err => console.log(err));
    },
    computed: {
        curGroup: {
            get: function() {
                return store.state.curGroup ? store.state.curGroup : {};
            },
            set: function(val) {
                store.state.curGroup = val;
            }
        }
    },
    methods: {
        getWorkGroupId: function() {
            info.getSession('workGroup').then(data => this.curGroup = data.value);
            return Promise.resolve();
        },
        noFetchData: function() {
            return Promise.resolve();
        },
        fetchGroupsData: function(params) {
            return data.fetchTable(store, 'setGroupsData', methods.fetchGroupsData, params);
        },
        fetchGroupInfo: function(params) {
            if (this.curGroup.id)
                return data.fetchStore(store, 'setGroupInfo', methods.fetchGroupInfo, this.curGroup.id);
            else return Promise.resolve();
        },
        fetchAnalyzesData: function(params) {
            if (this.curGroup.id) {
                params = object.setProp(params ? params : {}, 'groupId', this.curGroup.id);
                return data.fetchTable(store, 'setAnalyzesData', methods.fetchAnalyzesData, params);
            } else return Promise.resolve();
        },
        fetchGroupSettings: function(params) {
            if (this.curGroup.id)
                return data.fetchStore(store, 'setGroupSettings', methods.fetchGroupSettings, this.curGroup.id);
            else return Promise.resolve();
        },
        fetchAddGroupData: function(params) {
            console.log("fetchAddGroupData:");
            console.log(params);
            if (check.isUnd(params))
                return data.fetchTable(store, 'setAddGroupData', methods.fetchAddGroupData, params);
            else if (check.notUnd(params) && check.notUnd(params.isColl) && params.isColl)
                return data.fetchTable(store, 'setAddGroupCollData', methods.fetchAddGroupData, params);
            else if (check.notUnd(params) && check.notUnd(params.isMan) && params.isMan)
                return data.fetchTable(store, 'setAddGroupManData', methods.fetchAddGroupData, params);
            else if (check.notUnd(params) && check.notUnd(params.isAnal) && params.isAnal)
                return data.fetchTable(store, 'setAddGroupAnalData', methods.fetchAddGroupData, params);
            else if (check.notUnd(params) && check.notUnd(params.isAnk) && params.isAnk)
                return data.fetchTable(store, 'setAddGroupAnkData', methods.fetchAddGroupData, params);
            else return data.fetchTable(store, 'setAddGroupData', methods.fetchAddGroupData, params);
        },
        fetchColsData: function() {
            return data.fetchStore(store, 'setColsData', methods.fetchColsData);
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
            console.log(this.curGroup.id);
            this.fetchMainInfo()
                .then(() => Promise.resolve({ pageNum: this.$route.params.pageNum }))
                .then(this.fetchGroupsData)
                .then(this.fetchAddGroupData)
                .then(data => console.log(data))
                .then(this.fetchGroupInfo)
                .then(data => console.log(data))
                .then(() => Promise.resolve({ pageNum: this.$route.params.pageNum }))
                .then(this.fetchAnalyzesData)
                .then(data => {
                    console.log(this.$store.state);
                    console.log(data);
                })
                .then(this.fetchGroupSettings)
                .then(this.fetchColsData)
                //.then(() => Promise.resolve(this.curGroup.id))
                //.then(this.fetchSettingsInfo)
                .then(() => console.log("success fetch data"))
                .catch((err) => console.log(err));
        },
        changeCommand: function(index) {
            console.log(index);
            if (index === 1) this.isArrows = true;
            else this.isArrows = false;
            Command.executeMethod(this, this.command, index)
                .then(() => console.log("success fetch command data"))
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