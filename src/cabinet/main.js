import Vue from 'vue'
//import MainMenu from '../common/MainMenu.vue'
import MainCabinet from './entry/MainCabinet.vue'

// new Vue({
//     el: '#mainMenu',
//     render: h => h(MainMenu)
// });

new Vue({
    el: '#app',
    render: h => h(MainCabinet)
});