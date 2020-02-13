import Vue from "vue";
import Modernizr from "./modernizr";
// import GigWidget from "./components/GigWidget.vue";
import RecordPlayer from "./components/RecordPlayer.vue";

// const gigs = new Vue({
//   render: h => h(GigWidget)
// }).$mount(".GigWidget");

Array.prototype.forEach.call(
  document.querySelectorAll(".RecordPlayer"),
  function(elem) {
    new Vue({
      render: h =>
        h(RecordPlayer, {
          props: JSON.parse(elem.nextElementSibling.innerHTML)
        })
    }).$mount(elem);
  }
);

// const audio2 = new Vue({
//   render: h => h(RecordPlayer)
// }).$mount(".player");
