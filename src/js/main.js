import Vue from "vue";
import GigWidget from "./components/GigWidget.vue";
import RecordPlayer from "./components/RecordPlayer.vue";

const gigs = new Vue({
  render: h => h(GigWidget)
}).$mount(".giglink");

const audio = new Vue({
  render: h => h(RecordPlayer)
}).$mount(".player");
