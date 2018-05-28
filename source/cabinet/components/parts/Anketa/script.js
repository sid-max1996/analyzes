const front = require('../../../../../core/front');
const auth = front.serv.auth;
const cabinet = front.serv.cabinet;
const alert = front.comp.alert;

import Alert from '../../../../../core/front/modules/comp/Alert/main.vue'

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
                .then(cabinet.saveAnketa)
                .then(answer => {
                    alert.showToggle(answer.success, this, answer.error, 'данные сохранены',
                        'alertInfo', 'alertText', 'isAlert');
                })
                .catch((err) => console.log(err));
        }
    }
}