const auth = require('../../../../front_modules/service/auth');
const users = require('../../../../front_modules/service/users');
const front = require('../../../../front_modules/front');

import Alert from '../../../../common/Alert.vue'

export default {
    data() {
        return {
            isAlert: false,
            alertText: null,
            alertInfo: null
        };
    },
    computed: {
        contentInfo: function() {
            return this.$store.state.anketaInfo;
        }
    },
    components: {
        'Alert': Alert
    },
    methods: {
        saveAnketa: function() {
            let self = this;
            auth.nextAccess()
                .then(() => Promise.resolve({
                    firstName: self.contentInfo.firstName,
                    secondName: self.contentInfo.secondName,
                    phone: self.contentInfo.phone,
                    city: self.contentInfo.city,
                    workPlace: self.contentInfo.workPlace,
                    aboutYourself: self.contentInfo.aboutYourself
                }))
                .then(users.saveAnketa)
                .then(answer => {
                    front.showAlertToggle(answer.success, this, answer.error, 'данные сохранены',
                        'alertInfo', 'alertText', 'isAlert');
                })
                .catch((err) => console.log(err));
        }
    }
}