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
        },
        roleId: {
            type: Number,
            default: 0
        }
    },
    methods: {
        onCommandChange: function(index) {
            $('#commandsCollapse').collapse('hide');
            this.$emit('commandSelect', index);
        }
    },
    computed: {
        filteredCommands: function() {
            let roleId = this.roleId;
            console.log(roleId);
            return this.commandsList.filter(function(elem) {
                if (elem.roleId <= roleId) return true;
                else return false;
            })
        }
    }
}