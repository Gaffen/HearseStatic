'use strict';

const lightbox = document.getElementById('lightbox');
let scrollPos = document.documentElement.scrollTop;

if(lightbox){
  lightbox.addEventListener('click', e => {
    if(e.target == lightbox){
      lightbox.style.opacity = 0;
      document.documentElement.style.scrollBehavior = 'auto';
      setTimeout(function(){
        lightbox.style.display = 'none';
        document.documentElement.classList.remove('lightbox--lock');
        document.documentElement.scrollTop = scrollPos;
        document.body.scrollTop = scrollPos;
        setTimeout(function(){
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 150);
      }, 150);
    }
  });
}

export default (elem) => {
  elem.addEventListener("click", e => {
    scrollPos = document.documentElement.scrollTop;
    e.preventDefault();
    lightbox.dataset["type"] = e.target.dataset["lightboxType"];
    if(e.target.dataset["lightboxType"] == 'iframe'){
      lightbox.querySelector('.lightbox--content').innerHTML = `<iframe width="100%" height="100%" src="${e.target.href}"></iframe>`;
    }
    lightbox.style.opacity = 0;
    lightbox.style.display = 'block';
    scrollPos = document.documentElement.scrollTop ?
      document.documentElement.scrollTop : document.body.scrollTop();
    document.documentElement.style.top = -scrollPos + 'px';
    document.documentElement.classList.add('lightbox--lock');
    setTimeout(function(){
      lightbox.style.opacity = 1;
    }, 50);
  });
};