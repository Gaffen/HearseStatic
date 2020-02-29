import Vue from "vue";
import Modernizr from "./modernizr";
// import GigWidget from "./components/GigWidget.vue";
import RecordPlayer from "./components/RecordPlayer.vue";
import lightbox from "./modules/lightbox";

// const gigs = new Vue({
//   render: h => h(GigWidget)
// }).$mount(".GigWidget");

Array.prototype.forEach.call(
  document.querySelectorAll(".launch__lightbox"),
  elem => {
    lightbox(elem);
  }
);

// if(Modernizr.webaudio){
Array.prototype.forEach.call(
  document.querySelectorAll(".RecordPlayer"),
  function(elem) {
    new Vue({
      render: h =>
        h(RecordPlayer, {
          props:JSON.parse(elem.nextElementSibling.innerHTML)
        })
    }).$mount(elem);
  }
);
// }

Array.prototype.forEach.call(
  document.querySelectorAll(".fullpage__downarrow"),
  elem => {
    elem.addEventListener('click', e => {
      e.preventDefault();
      const height = "innerHeight" in window
               ? window.innerHeight
               : document.documentElement.offsetHeight;
      window.scrollBy({
        top: height, // could be negative value
        left: 0,
        behavior: 'smooth'
      });
    });
  }
);

// const audio2 = new Vue({
//   render: h => h(RecordPlayer)
// }).$mount(".player");
