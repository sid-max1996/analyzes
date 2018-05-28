const auth = require('../../../core/front').serv.auth;

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
            auth.getAuthInfo(this.login, this.password)
                .then(auth.getSessionInfo)
                .then(auth.getAccess)
                .then(auth.entryCabinet)
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