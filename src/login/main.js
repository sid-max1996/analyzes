import Vue from 'vue'
import Login from './Login.vue'
import Test from './Test.vue'

// import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

//import ajax from 'modules/ajax.js' 

// Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  render: h => h(Login)
});

// new Vue({
//   el: '#test',
//   render: h => h(Test)
// });