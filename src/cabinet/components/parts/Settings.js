const auth = require('../../../front_modules/service/auth');
const user = require('../../../front_modules/service/user');
const helper = require('../../../front_modules/helper');

export default {
    data() {
        return {
            errorCode: 0,
            errorText: null
        };
    },
    props: {
        settingsInfo: {
            type: Object,
            default: function() {
                return {
                    email: null,
                    password1: null,
                    password2: null,
                };
            }
        }
    },
    methods: {
        saveSettings: function() {
            let self = this;
            auth.nextAccess()
                .then(() => {
                    let password1 = self.settingsInfo.password1;
                    let password2 = self.settingsInfo.password2;
                    return Promise.resolve({
                        email: self.settingsInfo.email,
                        password: (password1 != null && password1 != "" && password1.length >= 8 &&
                            password1 === password2) ? password1 : null
                    })
                })
                .then(user.saveSettings)
                .catch((err) => console.log(err));
        }
    },
    computed: {
        errorTextComp: function() {
            let password1 = this.settingsInfo.password1;
            let password2 = this.settingsInfo.password2;
            if (password1 != null && password1 != "" && password1.length < 8) {
                this.errorCode = 1;
                this.errorText = "Длина пароля должна быть не менее 8 символов";
            } else if (password1 != null && password1 != "" && password1 !== password2) {
                this.errorCode = 2;
                this.errorText = "Введенные пароли не совпадают";
            } else {
                this.errorCode = 0;
                this.errorText = null;
            }
            return this.errorText;
        }
    }
}