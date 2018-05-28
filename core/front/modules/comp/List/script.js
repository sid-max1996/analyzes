export default {
    data() {
        return {};
    },
    props: {
        titles: {
            type: Array,
            default: function() { return [] }
        },
        data: {
            type: Array,
            default: function() { return [] }
        },
        btns: {
            type: Array,
            default: function() { return [] }
        }
    },
    methods: {
        btnClick: function(ind, eventName) {
            this.$emit(eventName, ind);
        }
    }
}