import Vue from "vue";
import GigWidget from "./components/GigWidget.vue";
import RecordPlayer from "./components/RecordPlayer.vue";

const gigs = new Vue({
  render: h => h(GigWidget)
}).$mount(".GigWidget");

const audio = new Vue({
  render: h => h(RecordPlayer, { props: { record: "/music/last_time.mp3" } })
}).$mount(".RecordPlayer");

const audio2 = new Vue({
  render: h => h(RecordPlayer)
}).$mount(".player");
