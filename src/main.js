import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import Alphabet from 'alphabetjs'

Vue.use(VueAxios, Axios)

new Vue({
  el: '#app',
  render: h => h(App)
})

console.log(Alphabet('Hello', 'planar') + '\r\n' +
  '%cHomework Upload V2 beta' +
  '%c, build by ' +
  '%cdelbertbeta' +
  '%c(https://delbertbeta.cc) with ' +
  '%clove' +
  '%c.',
  'color: #4787ff',
  'color: black',
  'color: #4787ff',
  'color: black',
  'color: red',
  'color: black'
)
