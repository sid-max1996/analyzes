const auth = require('../../front_modules/service/auth');
const user = require('../../front_modules/service/user');
const helper = require('../../front_modules/helper');

import Anketa from '../components/Anketa.vue'
import Settings from '../components/Settings.vue'

export default {
    data() {
        return {
            userName: null,
            roleName: null,
            photoPath: null,
            aboutYourself: null,
            defaultPhotoPath: "img/profile.jpg"
        };
    },
    components: {
        'Anketa': Anketa,
        'Settings': Settings
    },
    props: { commandIndex: Number },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let self = this;
            auth.nextAccess()
                .then(user.getUserData)
                .then((userData) => {
                    self.userName = userData.userName;
                    self.roleName = userData.roleName;
                    self.aboutYourself = helper.jsonNullFilter(userData.aboutYourself);
                    self.photoPath = helper.jsonNullFilter(userData.photoPath);
                })
                .catch((err) => console.log(err));
        }
    }
}