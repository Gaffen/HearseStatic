import Vue from "vue";
import GigWidget from "./components/GigWidget.vue";

const gigs = new Vue({
  render: h => h(GigWidget)
}).$mount("#nextshow");
