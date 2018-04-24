import MainTemplate from '../../../common/MainTemplate.vue'
import Cabinet from '../../components/Cabinet.vue'
import Anketa from '../../components/Anketa.vue'
import Settings from '../../components/Settings.vue'

const auth = require('../../../front_modules/service/auth');
const user = require('../../../front_modules/service/user');
const session = require('../../../front_modules/service/session');
const helper = require('../../../front_modules/helper');

export default {
    data() {
        return {
            commandsInfo: {
                commandIndex: 0,
                commandsList: ["Профиль", "Анкета", "Настройки"]
            },
            menuInfo: {},
            cabinetInfo: {},
            anketaInfo: {},
            settingsInfo: {},
        };
    },
    components: {
        'MainTemplate': MainTemplate,
        'Cabinet': Cabinet,
        'Anketa': Anketa,
        'Settings': Settings
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchCabinetInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                auth.nextAccess()
                    .then(user.getUserData)
                    .then((userData) => {
                        self.cabinetInfo = {
                            userName: userData.userName,
                            roleName: userData.roleName,
                            aboutYourself: helper.jsonNullFilter(userData.aboutYourself),
                            photoPath: helper.jsonNullFilter(userData.photoPath),
                            defaultPhotoPath: "img/profile.jpg"
                        };
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchAnketaInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                auth.nextAccess()
                    .then(user.getAnketaData)
                    .then((anketaData) => {
                        self.anketaInfo = {
                            firstName: helper.jsonNullFilter(anketaData.firstName),
                            secondName: helper.jsonNullFilter(anketaData.secondName),
                            phone: helper.jsonNullFilter(anketaData.phone),
                            city: helper.jsonNullFilter(anketaData.city),
                            workPlace: helper.jsonNullFilter(anketaData.workPlace),
                            aboutYourself: helper.jsonNullFilter(anketaData.aboutYourself)
                        }
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchSettingsInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                auth.nextAccess()
                    .then(user.getSettingsData)
                    .then((settingsData) => {
                        self.settingsInfo = { email: helper.jsonNullFilter(settingsData.email) };
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchMenuInfo: function() {
            let self = this;
            return new Promise((resolve, reject) => {
                session.getValue('isDarkScheme')
                    .then((jsonObj) => {
                        self.menuInfo = { isDarkScheme: jsonObj.value };
                        resolve();
                    })
                    .catch((err) => reject(err));
            });
        },
        fetchData: function() {
            this.fetchMenuInfo()
                .then(this.fetchCabinetInfo)
                .then(() => console.log("success fetch data"))
                .catch((err) => console.log(err));
        },
        fetchDataByCommand: function(index) {
            return new Promise((resolve, reject) => {
                let getContentInfo = () => reject();
                switch (index) {
                    case 0:
                        getContentInfo = this.fetchCabinetInfo;
                        break;
                    case 1:
                        getContentInfo = this.fetchAnketaInfo;
                        break;
                    case 2:
                        getContentInfo = this.fetchSettingsInfo;
                        break;
                };
                getContentInfo()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            });
        },
        changeCommand: function(index) {
            this.commandsInfo.commandIndex = index;
            this.fetchDataByCommand(index)
                .then(() => console.log("success fetch command data"))
                .catch((err) => console.log(err));
        }
    }
}