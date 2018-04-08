<template>
    <div id="auth">
      <div class="container">
        <div class="row">
              <button @click="auth">auth</button>
              <button @click="session">session</button>
              <button @click="access">access</button>
        </div>
        <div class="row"><button @click="addUser">addUser</button></div>
        <div class="row">{{answer}}</div>
    </div>
    </div>
</template>

<script>
const ajax = require('../front_modules/ajax.js');

export default {
  data () {
    return {
      answer: ""
    }
  },
  methods: {
    apiMethod: function(apiPath, jsonObjSend) {
      ajax.apiMethod(apiPath, jsonObjSend, (err, answerJson) => {
        if (err) 
          return console.log(err);
        console.log(answerJson);
        this.answer = answerJson;
      });  
    },
    auth: function() {
      console.log('auth');
      let jsonObjSend = {
        login: 'user2' 
      }
      let apiPath = "api/auth";
      this.apiMethod(apiPath, jsonObjSend);
    },
    session: function() {
      console.log('session');
      let password = 'password1';
      let secret = '52e9f5816467f772be5f';
      const crypto = require('../front_modules/crypto.js');
      let hashPass = crypto.encrypt(password, secret);
      let jsonObjSend = {
        authId: '5ac8e30a4ea50c1238a73be5',
        hashPass: hashPass
      }
      let jsonSend = JSON.stringify(jsonObjSend);
      let apiPath = "api/session";
      this.apiMethod(apiPath, jsonObjSend);
    },
    access: function() {
      console.log('access');
      let accessString = 'baa9fad21ed2d73b67f7cf1a4f0c6217d31b286325f38dc5ad';
      let secret = '65933db966ecf7b50a69';
      const crypto = require('../front_modules/crypto.js');
      let hashValue = crypto.makeHash(accessString, secret);
      console.log(`hashValue = ${hashValue}`);
      let jsonObjSend = {
        sessionId: "5ac92f0a00b6f922348fc145",
        hashValue: hashValue
      }
      let jsonSend = JSON.stringify(jsonObjSend);
      let apiPath = "api/access";
      this.apiMethod(apiPath, jsonObjSend);
    },
    addUser: function() {
      console.log('addUser');
      let jsonObjSend = {
        login: 'user2',
        password: 'password2',
        email: 'user2@yandex.ru'
      }
      let jsonSend = JSON.stringify(jsonObjSend);
      let apiPath = "api/add/user";
      this.apiMethod(apiPath, jsonObjSend);
    }
  }
}
</script>
 
<style>
#auth {
  margin-top: 50px;
}
.row {
  margin-bottom: 20px;
}
</style>