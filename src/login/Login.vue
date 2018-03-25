<template>
    <div id="login">
      <div class="container">
        <div class="form-signin">
          <div class="col-10 col-sm-8">
            <div class="row">
              <h2 class="form-heading">Вход</h2>
              <input type="text" v-model="loginComputed" class="form-control" placeholder="Логин" name="login">
              <input type="password" v-model="passwordComputed" class="form-control" placeholder="Пароль" name="password">
              <label class="checkbox">
                <input type="checkbox" v-model="isRememberComputed" value="remember-me"> Запомнить
              </label>
            </div>
            <div class="row">
              <button v-on:click="doEntry" class="btn btn-large btn-primary" type="submit">Войти</button>
            </div>
          </div>
        </div>
      </div>
      <!-- <div>
          <h3>Введенная информация</h3>
          <p>Логин: {{login}}</p>
          <p>Пароль: {{password}}</p>
          <p>Чекбокс: {{isRemember}}</p>
      </div> -->
    </div>
</template>
 
<script>
const ajax = require('../front_modules/ajax.js');
const crypto = require('../front_modules/crypto.js');
console.log(crypto);
export default {
  data () {
    return {
      login: null,
      password: null,
      isRemember: null,
      userId: null,
      hash: null,
      secret: null
    }
  },
  methods:{
    doEntry: function() {
      let params = "login=" + this.login;
      ajax.post(ajax.SERVER_ADDRESS + "api/secretkey", params)
        .then((json) => {
          let jsonObj = JSON.parse(json);
          this.secret = jsonObj.secretkey;
          this.userId = jsonObj.userId;
          console.log(this.secret);
          let value = this.userId + this.login;
          this.hash = crypto.makeHash(value, this.secret);
          return Promise.resolve(this);
        })
        .then((self) => {
          console.log(self.hash);
          let cryptoPassword = crypto.encrypt(self.password, self.secret);
          let params = `userId=${self.userId}&password=${cryptoPassword}&hash=${self.hash}`;
          ajax.post(ajax.SERVER_ADDRESS + "api/login", params).then((json) => {
            let secret = JSON.parse(json).secretkey;
            console.log('success secret = ' + secret);
          }).catch(error => console.error(error));
        })
        .catch(error => console.error(error));  
    },
    setMethod: function(dataName){
      let isRemember = localStorage.getItem("isRemember");
      if (isRemember === 'true' && this[dataName] === null && window.localStorage) {
        let storageValue = localStorage.getItem(dataName);
        this[dataName] = storageValue;
      }
      return this[dataName];
    },
    getMethod: function(dataName, newValue){
      let isRemember = localStorage.getItem("isRemember");
      if (isRemember === 'true') {
        localStorage.setItem(dataName, newValue);
      }
      else {
        localStorage.removeItem(this[dataName]);
      }
      this[dataName] = newValue;
    }
  },
  computed:{
    isRememberComputed: {
      get: function () {
        let isRemember = localStorage.getItem("isRemember");
        console.log("isRemember = " + isRemember);
        if (isRemember !== null && this.isRemember === null) {
          this.isRemember = isRemember === 'true' ? true : false;
        }
        return this.isRemember === true;
      },
      set: function (newValue) {   
        localStorage.setItem("isRemember", newValue);       
        if (!newValue) {
          localStorage.removeItem("login");
          localStorage.removeItem("password");
        }
        else {
          localStorage.setItem("login", this.login);
          localStorage.setItem("password", this.password);
        }
        this.isRemember = newValue;
      }
    },
    loginComputed: {
        get: function () {
          return this.setMethod('login');
        },
        set: function (newValue) {
          this.getMethod('login', newValue);
        }
    },
    passwordComputed: {
        get: function () {
          return this.setMethod('password');
        },
        set: function (newValue) {
          this.getMethod('password', newValue);
        }
    }
  }
}
</script>
 
<style>
  .form-signin {
    padding-top: 25%;
    padding-left: 20%;
  }
  .form-control {
    margin-bottom: 10px;
  }
</style>