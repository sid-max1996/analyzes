export default {
    data() {
        return {};
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        info: {
            type: String,
            default: 'info'
        },
        text: {
            type: String,
            default: ''
        },
    },
    computed: {
        getAlertClass: function() {
            return 'alert-' + this.info;
        }
    }
}