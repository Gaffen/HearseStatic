import Vue from "vue";
import Modernizr from "./modernizr";
// import GigWidget from "./components/GigWidget.vue";
import RecordPlayer from "./components/RecordPlayer.vue";
import lightbox from "./modules/lightbox";
import Glide, { Autoplay, Keyboard, Controls } from '@glidejs/glide/dist/glide.modular.esm';

// const gigs = new Vue({
//   render: h => h(GigWidget)
// }).$mount(".GigWidget");

Array.prototype.forEach.call(
  document.querySelectorAll(".launch__lightbox"),
  elem => {
    lightbox(elem);
  }
);

let header = document.querySelector('.header__nav');

if(header){
  header.addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('header__checkbox').checked = false;
  });
}

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

const announcements = document.querySelectorAll('.announcements__slide');

if(announcements.length > 1){
  const carousel = new Glide('.announcements', {type: 'carousel', animationDuration: 1000, autoplay: 5000, gap: 0}).mount({Autoplay, Controls, Keyboard});

  [...document.querySelectorAll('.announcements .videoplayer')]
    .forEach((item, i) => {
      if(!item.querySelector('.videoplayer__iframe')){
        item.addEventListener('click', e => {
          item.appendChild(
            document
              .createRange()
              .createContextualFragment(`<div class="videoplayer__iframe">${item.dataset.video}</div>`)
          );
          carousel._o.autoplay = false;
          // carousel.disable();
        });
      }
    });
}


// const audio2 = new Vue({
//   render: h => h(RecordPlayer)
// }).$mount(".player");
