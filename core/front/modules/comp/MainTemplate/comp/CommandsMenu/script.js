export default {
    data() {
        return {
            left: 0
        };
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
        },
        isArrows: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onCommandChange: function(index) {
            this.$emit('commandSelect', index);
        },
        arrowClick: function(dir) {
            switch (dir) {
                case 'up':
                    $(document).scrollTop(0);
                    break;
                case 'down':
                    $(document).scrollTop($(document).height());
                    break;
                case 'left':
                    this.left = 0;
                    $('#arrow-table').scrollLeft(this.left);
                    break;
                case 'right':
                    this.left += 500;
                    $('#arrow-table').scrollLeft(this.left);
                    break;
            }
        }
    },
    computed: {
        filteredCommands: function() {
            let roleId = this.roleId;
            return this.commandsList.filter(function(elem) {
                if (elem.roleId <= roleId) return true;
                else return false;
            })
        }
    }
}

$(document).on('click', function(event) {
    let target = $(event.target);
    if (target.id != 'commandsSlideBtn')
        $('#commandsCollapse').collapse('hide');
});