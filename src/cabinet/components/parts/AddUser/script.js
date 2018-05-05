const auth = require('../../../../front_modules/service/auth');
const info = require('../../../../front_modules/service/info');
const admin = require('../../../../front_modules/service/users/admin');
const front = require('../../../../front_modules/front');

import Alert from '../../../../common/Alert.vue'

export default {
    data() {
        return {
            isAlert: false,
            alertText: null,
            alertInfo: null,
            roles: null,
            userName: null,
            selectedRole: null,
            password: null,
            email: null
        };
    },
    created: function() {
        info.getOptionsInfo('role')
            .then(options => this.roles = options)
            .catch(err => console.log(err));
    },
    components: {
        'Alert': Alert
    },
    methods: {
        addUser: function() {
            let self = this;
            auth.nextAccess()
                .then(() => Promise.resolve({
                    userName: self.userName,
                    roleId: self.selectedRole.value,
                    password: self.password,
                    email: self.email
                }))
                .then(admin.addUser)
                .then(answer => {
                    front.showAlertToggle(answer.success, self, answer.error, 'пользователь успешно добавлен',
                        'alertInfo', 'alertText', 'isAlert');
                })
                .catch((err) => console.log(err));
        }
    }
}