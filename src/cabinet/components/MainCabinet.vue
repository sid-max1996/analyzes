<template>
    <div id="content" class="container-fluid">
        <div class="row">
        <div id="commandsSlideDiv" class="col-2 col-sm-1">
            <CommandsMenu @commandSelect="commandChange" :commandsList="commandsList"></CommandsMenu>
        </div>
        <div id="bodyContent" class="col-10 col-sm-11">
            <Cabinet :commandIndex="commandIndex"></Cabinet>
        </div>
    </div>
    </div>
</template>

<style>
    #content {
        margin-left: 0;
    }
    #bodyContent {
        margin-top: 25px;
    }
</style>

<script>
import Cabinet from './Cabinet.vue'
import CommandsMenu from '../../common/CommandsMenu.vue'
export default {
    data() {
        return {
            commandIndex: null,
            commandsList: ["Редактировать", "Настройки"]
        };
    },
    components:{
        'Cabinet': Cabinet,
        'CommandsMenu': CommandsMenu
    },
    methods: {
        commandChange: function(index) {
            console.log(`command index = ${index}`);
            this.commandIndex = index;
        }
    }
}
</script>