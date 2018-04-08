const ajax = require('../../front_modules/ajax.js');
const crypto = require('../../front_modules/crypto.js');
console.log(crypto);
export default {
    data() {
        return {
            login: null,
            password: null,
            isRemember: null
        }
    },
    methods: {
        doEntry: function() {
            let jsonObjSend = {
                login: this.login
            };
            let jsonSend = JSON.stringify(jsonObjSend);
            ajax.json("api/auth", jsonSend)
                .then((json) => {
                    console.log(`auth json: ${json}`);
                    let jsonObj = JSON.parse(json);
                    console.log(`authId = ${jsonObj.authId} password = ${this.password} secret = ${jsonObj.secret}`);
                    return Promise.resolve({
                        authId: jsonObj.authId,
                        password: this.password,
                        secret: jsonObj.secret
                    });
                })
                .then((params) => {
                    let { authId, password, secret } = params;
                    let hashPass = crypto.encrypt(password, secret);
                    let jsonObjSend = {
                        authId: authId,
                        hashPass: hashPass
                    };
                    let jsonSend = JSON.stringify(jsonObjSend);
                    ajax.json("api/session", jsonSend).then((json) => {
                        console.log(`session json: ${json}`);
                        let jsonObj = JSON.parse(json);
                        console.log(`success end`);
                    }).catch(error => console.error(error));
                })
                .catch(error => console.error(error));
        },
        setMethod: function(dataName) {
            let isRemember = localStorage.getItem("isRemember");
            if (isRemember === 'true' && this[dataName] === null && window.localStorage) {
                let storageValue = localStorage.getItem(dataName);
                this[dataName] = storageValue;
            }
            return this[dataName];
        },
        getMethod: function(dataName, newValue) {
            let isRemember = localStorage.getItem("isRemember");
            if (isRemember === 'true') {
                localStorage.setItem(dataName, newValue);
            } else {
                localStorage.removeItem(this[dataName]);
            }
            this[dataName] = newValue;
        }
    },
    computed: {
        isRememberComputed: {
            get: function() {
                let isRemember = localStorage.getItem("isRemember");
                console.log("isRemember = " + isRemember);
                if (isRemember !== null && this.isRemember === null) {
                    this.isRemember = isRemember === 'true' ? true : false;
                }
                return this.isRemember === true;
            },
            set: function(newValue) {
                localStorage.setItem("isRemember", newValue);
                if (!newValue) {
                    localStorage.removeItem("login");
                    localStorage.removeItem("password");
                } else {
                    localStorage.setItem("login", this.login);
                    localStorage.setItem("password", this.password);
                }
                this.isRemember = newValue;
            }
        },
        loginComputed: {
            get: function() {
                return this.setMethod('login');
            },
            set: function(newValue) {
                this.getMethod('login', newValue);
            }
        },
        passwordComputed: {
            get: function() {
                return this.setMethod('password');
            },
            set: function(newValue) {
                this.getMethod('password', newValue);
            }
        }
    }
}