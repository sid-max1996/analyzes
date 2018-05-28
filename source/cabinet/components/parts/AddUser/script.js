const front = require('../../../../../core/front');
const lib = require('../../../../../core/lib');
const info = front.serv.info;
const auth = front.serv.auth;
const cabinet = front.serv.cabinet;
const objArr = lib.meta.objArr;
const alert = front.comp.alert;


import Alert from '../../../../../core/front/modules/comp/Alert/main.vue'

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
        info.getRoleInfo()
            .then(data => Promise.resolve(
                objArr.freshProps(data, ['title', 'value'], ['roleName', 'roleId'])))
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
                .then(cabinet.addUser)
                .then(answer => {
                    alert.showToggle(answer.success, self, answer.error, 'пользователь успешно добавлен',
                        'alertInfo', 'alertText', 'isAlert');
                })
                .catch((err) => console.log(err));
        }
    }
}