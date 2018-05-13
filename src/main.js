import Vue from 'vue'
import App from './App.vue'

require.context("./assets/", true, /^\.\/.*\.[png|jpg]/);

new Vue({
  el: '#app',
  render: h => h(App)
})
