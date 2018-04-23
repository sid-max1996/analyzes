const auth = require('../../front_modules/service/auth');
const session = require('../../front_modules/service/session');

export default {
    data() {
        return {
            noticeCount: 0,
            isDarkScheme: false
        };
    },
    created: function() {
        this.fetchData();
    },
    methods: {
        fetchData: function() {
            let self = this;
            session.getValue('isDarkScheme')
                .then((jsonObj) => {
                    self.isDarkScheme = jsonObj.value;
                })
                .catch((err) => console.log(err));
        },
        doLogout: function() {
            auth.nextAccess()
                .then(auth.doLogout)
                .catch((err) => console.log(err));
        },
        switchColorScheme: function() {
            if (this.isDarkScheme) {
                $("body").removeClass('bodyLight');
                $("body").addClass('bodyDark');
            } else {
                $("body").removeClass('bodyDark');
                $("body").addClass('bodyLight');
            }
            session.setValue('isDarkScheme', this.isDarkScheme);
        }
    }
}