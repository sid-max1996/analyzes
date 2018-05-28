const auth = require('../../../../serv').auth;
const info = require('../../../../serv').info;

export default {
    data() {
        return {};
    },
    props: {
        menuInfo: {
            type: Object,
            default: function() {
                return {
                    curItemInd: 0,
                    isDarkScheme: false
                };
            }
        }
    },
    computed: {
        isWhiteScheme: function() {
            return !this.menuInfo.isDarkScheme;
        },
        isDarkScheme: {
            get: function() {
                return this.menuInfo.isDarkScheme;
            },
            set: function(value) {
                this.menuInfo.isDarkScheme = value;
            }
        }
    },
    methods: {
        doLogout: function() {
            auth.nextAccess()
                .then(auth.doLogout)
                .catch((err) => console.log(err));
        },
        switchColorScheme: function() {
            if (this.menuInfo.isDarkScheme) {
                $("body").removeClass('bodyLight');
                $("body").addClass('bodyDark');
            } else {
                $("body").removeClass('bodyDark');
                $("body").addClass('bodyLight');
            }
            info.setSession('colorScheme', this.menuInfo.isDarkScheme ? 'dark' : 'light');
        },
        getIsActiveItem: function(index) {
            return this.menuInfo.curItemInd === index;
        }
    }
}