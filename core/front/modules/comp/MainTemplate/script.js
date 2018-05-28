import MainMenu from './comp/MainMenu/main.vue'
import CommandsMenu from './comp/CommandsMenu/main.vue'

export default {
    components: {
        'MainMenu': MainMenu,
        'CommandsMenu': CommandsMenu
    },
    props: {
        commandsList: Array,
        roleId: Number,
        menuInfo: Object,
        isArrows: Boolean
    },
    methods: {
        commandChange: function(index) {
            this.$emit('commandChange', index);
        }
    }
}