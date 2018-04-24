export default {
    data() {
        return {};
    },
    props: {
        commandsList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    methods: {
        onCommandChange: function(index) {
            $('#commandsCollapse').collapse('hide');
            this.$emit('commandSelect', index);
        }
    }
}