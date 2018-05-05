const Command = require('../../../front_modules/front/command');
const info = require('../../../front_modules/service/info');
const methods = require('./source/methods');

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
Vue.use(VueRouter)
Vue.use(Vuex)

import MainTemplate from '../../../common/MainTemplate.vue'
import Cabinet from '../../components/Cabinet.vue'
import Anketa from '../../components/Anketa.vue'
import Settings from '../../components/Settings.vue'
import Admin from '../../components/Admin.vue'
import AddUser from '../../components/AddUser.vue'

const store = new Vuex.Store(require('./source/store'));
const pathList = ['/cabinet', '/cabinet/anketa', '/cabinet/settings', '/cabinet/admin/:pageNum', '/cabinet/addUser'];

export default {
    data() {
        return {
            command: new Command(['fetchCabinetInfo', 'fetchAnketaInfo', 'fetchSettingsInfo', 'fetchAdminInfo']),
            roleId: 0,
            commandsList: [
                { path: pathList[0], title: "Профиль", roleId: 1 },
                { path: pathList[1], title: "Анкета", roleId: 1 },
                { path: pathList[2], title: "Настройки", roleId: 1 },
                { path: pathList[3].replace(':pageNum', '1'), title: "Админка", roleId: 3 }
            ],
            menuInfo: {}
        };
    },
    store,
    components: {
        'MainTemplate': MainTemplate,
        'Cabinet': Cabinet,
        'Anketa': Anketa,
        'Settings': Settings,
        'Admin': Admin,
        'AddUser': AddUser
    },
    router: new VueRouter({
        mode: 'history',
        routes: [
            { path: pathList[0], component: Cabinet },
            { path: pathList[1], component: Anketa },
            { path: pathList[2], component: Settings },
            { path: pathList[3], component: Admin },
            { path: pathList[4], component: AddUser },
        ]
    }),
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchCabinetInfo: function() {
            return info.fetchStoreInfo(store, 'setCabinetInfo', methods.fetchCabinetInfo);
        },
        fetchAnketaInfo: function() {
            return info.fetchStoreInfo(store, 'setAnketaInfo', methods.fetchAnketaInfo);
        },
        fetchSettingsInfo: function() {
            return info.fetchStoreInfo(store, 'setSettingsInfo', methods.fetchSettingsInfo);
        },
        fetchAdminInfo: function(params) {
            let pageNum = 1;
            let rowCount = store.state.default.rowCount;
            let filter = null;
            if (params) {
                if (params.pageNum) pageNum = params.pageNum;
                if (params.rowCount) rowCount = params.rowCount;
                if (params.filter) filter = params.filter;
            }
            return info.fetchStoreInfo(store, 'setAdminInfo', methods.fetchAdminInfo, {
                roleId: this.roleId,
                pageNum: pageNum,
                rowCount: rowCount,
                filter: filter
            });
        },
        fetchMainTemplateInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                info.getMainTemplateInfo()
                    .then((resObj) => {
                        self.menuInfo = { curItemInd: 0, isDarkScheme: resObj.menuInfo.isDarkScheme };
                        self.roleId = resObj.commandsInfo.roleId;
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchData: function() {
            this.fetchMainTemplateInfo()
                .then(this.fetchCabinetInfo)
                .then(this.fetchAnketaInfo)
                .then(this.fetchSettingsInfo)
                .then(() => Promise.resolve({ pageNum: this.$route.params.pageNum }))
                .then(this.fetchAdminInfo)
                .then(() => console.log("success fetch data"))
                .catch((err) => console.log(err));
        },
        changeCommand: function(index) {
            console.log(index);
            Command.executeMethod(this, this.command, index)
                .then(() => console.log("success fetch command data"))
                .catch((err) => console.log(err));
        },
        changeData: function(index, params) {
            console.log(index);
            console.log(params);
            Command.executeMethod(this, this.command, index, params)
                .then(() => console.log("success change data"))
                .catch((err) => console.log(err));
        }
    }
}