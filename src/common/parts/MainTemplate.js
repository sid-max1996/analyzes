import MainMenu from '../components/MainMenu.vue'
import CommandsMenu from '../components/CommandsMenu.vue'

export default {
    components: {
        'MainMenu': MainMenu,
        'CommandsMenu': CommandsMenu
    },
    props: {
        commandsInfo: Object,
        menuInfo: Object
    },
    methods: {
        commandChange: function(index) {
            this.$emit('commandChange', index);
        }
    }
}