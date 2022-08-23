import Modernizr from './modernizr';
import SvelteRecordPlayer from './svelte/RecordPlayer/index.svelte';
import lightbox from './modules/lightbox';
import Glide, {
  Autoplay,
  Keyboard,
  Controls,
} from '@glidejs/glide/dist/glide.modular.esm';

const registerComponent = (component, name) => {
  document.querySelectorAll(`.svelte--${CSS.escape(name)}`).forEach(($el) => {
    const props = JSON.parse($el.dataset.props);
    new component({
      target: $el,
      props,
      hydrate: true,
    });
  });
};

Array.prototype.forEach.call(
  document.querySelectorAll('.launch__lightbox'),
  (elem) => {
    lightbox(elem);
  }
);

let header = document.querySelector('.header__nav');

if (header) {
  header.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('header__checkbox').checked = false;
  });
}

registerComponent(SvelteRecordPlayer, 'RecordPlayer');

const announcements = document.querySelectorAll('.announcements__slide');

if (announcements.length > 1) {
  const carousel = new Glide('.announcements', {
    type: 'carousel',
    animationDuration: 1000,
    autoplay: 5000,
    gap: 0,
  }).mount({ Autoplay, Controls, Keyboard });

  [...document.querySelectorAll('.announcements .videoplayer')].forEach(
    (item, i) => {
      if (!item.querySelector('.videoplayer__iframe')) {
        item.addEventListener('click', (e) => {
          item.appendChild(
            document
              .createRange()
              .createContextualFragment(
                `<div class="videoplayer__iframe">${item.dataset.video}</div>`
              )
          );
          carousel._o.autoplay = false;
        });
      }
    }
  );
}
