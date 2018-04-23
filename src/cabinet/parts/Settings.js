const auth = require('../../front_modules/service/auth');
const user = require('../../front_modules/service/user');
const helper = require('../../front_modules/helper');

export default {
    data() {
        return {
            email: null,
            password1: null,
            password2: null,
            errorCode: 0,
            errorText: null
        };
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let self = this;
            auth.nextAccess()
                .then(user.getSettingsData)
                .then((settingsData) => {
                    self.email = helper.jsonNullFilter(settingsData.email);
                })
                .catch((err) => console.log(err));
        },
        saveSettings: function() {
            let self = this;
            auth.nextAccess()
                .then(() => {
                    let password1 = self.password1;
                    let password2 = self.password2;
                    console.log((password1 != null && password1 != "" && password1.length >= 8 &&
                        password1 === password2) ? password1 : null);
                    return Promise.resolve({
                        email: self.email,
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
            let password1 = this.password1;
            let password2 = this.password2;
            if (password1 != null && password1 != "" && password1 !== password2) {
                this.errorCode = 1;
                this.errorText = "Введенные пароли не совпадают";
                if (password1.length < 8) {
                    this.errorCode = 2;
                    this.errorText = "Длина пароля должна быть не менее 8 символов";
                }
            } else {
                this.errorCode = 0;
                this.errorText = null;
            }
            return this.errorText;
        }
    }
}