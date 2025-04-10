/*! modernizr 3.13.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-objectfit-webaudio-mq-setclasses !*/
!function(e,n,t,r){function o(e,n){return typeof e===n}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):x?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function s(){var e=t.body;return e||(e=i(x?"svg":"body"),e.fake=!0),e}function a(e,n,r,o){var a,l,f,u,c="modernizr",d=i("div"),p=s();if(parseInt(r,10))for(;r--;)f=i("div"),f.id=o?o[r]:c+(r+1),d.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+c,(p.fake?p:d).appendChild(a),p.appendChild(d),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(t.createTextNode(e)),d.id=c,p.fake&&(p.style.background="",p.style.overflow="hidden",u=w.style.overflow,w.style.overflow="hidden",w.appendChild(p)),l=n(d,e),p.fake&&p.parentNode?(p.parentNode.removeChild(p),w.style.overflow=u,w.offsetHeight):d.parentNode.removeChild(d),!!l}function l(e,t,r){var o;if("getComputedStyle"in n){o=getComputedStyle.call(n,e,t);var i=n.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&e.currentStyle&&e.currentStyle[r];return o}function f(e,n){return!!~(""+e).indexOf(n)}function u(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function c(e,t){var o=e.length;if("CSS"in n&&"supports"in n.CSS){for(;o--;)if(n.CSS.supports(u(e[o]),t))return!0;return!1}if("CSSSupportsRule"in n){for(var i=[];o--;)i.push("("+u(e[o])+":"+t+")");return i=i.join(" or "),a("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"===l(e,null,"position")})}return r}function d(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function p(e,n,t,s){function a(){u&&(delete E.style,delete E.modElem)}if(s=!o(s,"undefined")&&s,!o(t,"undefined")){var l=c(e,t);if(!o(l,"undefined"))return l}for(var u,p,m,v,h,y=["modernizr","tspan","samp"];!E.style&&y.length;)u=!0,E.modElem=i(y.shift()),E.style=E.modElem.style;for(m=e.length,p=0;p<m;p++)if(v=e[p],h=E.style[v],f(v,"-")&&(v=d(v)),E.style[v]!==r){if(s||o(t,"undefined"))return a(),"pfx"!==n||v;try{E.style[v]=t}catch(e){}if(E.style[v]!==h)return a(),"pfx"!==n||v}return a(),!1}function m(e,n){return function(){return e.apply(n,arguments)}}function v(e,n,t){var r;for(var i in e)if(e[i]in n)return!1===t?e[i]:(r=n[e[i]],o(r,"function")?m(r,t||n):r);return!1}function h(e,n,t,r,i){var s=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+b.join(s+" ")+s).split(" ");return o(n,"string")||o(n,"undefined")?p(a,n,r,i):(a=(e+" "+P.join(s+" ")+s).split(" "),v(a,n,t))}var y=[],g={_version:"3.13.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){y.push({name:e,fn:n,options:t})},addAsyncTest:function(e){y.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=g,Modernizr=new Modernizr;var C=[],w=t.documentElement,x="svg"===w.nodeName.toLowerCase(),S=function(){var e=n.matchMedia||n.msMatchMedia;return e?function(n){var t=e(n);return t&&t.matches||!1}:function(e){var n=!1;return a("@media "+e+" { #modernizr { position: absolute; } }",function(e){n="absolute"===l(e,null,"position")}),n}}();g.mq=S,Modernizr.addTest("webaudio",function(){var e="webkitAudioContext"in n,t="AudioContext"in n;return Modernizr._config.usePrefixes?e||t:t});var _="Moz O ms Webkit",b=g._config.usePrefixes?_.split(" "):[];g._cssomPrefixes=b;var z={elem:i("modernizr")};Modernizr._q.push(function(){delete z.elem});var E={style:z.elem.style};Modernizr._q.unshift(function(){delete E.style});var P=g._config.usePrefixes?_.toLowerCase().split(" "):[];g._domPrefixes=P,g.testAllProps=h;var j=function(e){var t,o=prefixes.length,i=n.CSSRule;if(void 0===i)return r;if(!e)return!1;if(e=e.replace(/^@/,""),(t=e.replace(/-/g,"_").toUpperCase()+"_RULE")in i)return"@"+e;for(var s=0;s<o;s++){var a=prefixes[s];if(a.toUpperCase()+"_"+t in i)return"@-"+a.toLowerCase()+"-"+e}return!1};g.atRule=j;var N=g.prefixed=function(e,n,t){return 0===e.indexOf("@")?j(e):(-1!==e.indexOf("-")&&(e=d(e)),n?h(e,n,t):h(e,"pfx"))};Modernizr.addTest("objectfit",!!N("objectFit"),{aliases:["object-fit"]}),function(){var e,n,t,r,i,s,a;for(var l in y)if(y.hasOwnProperty(l)){if(e=[],n=y[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(r=o(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],a=s.split("."),1===a.length?Modernizr[a[0]]=r:(Modernizr[a[0]]&&(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean)||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=r),C.push((r?"":"no-")+a.join("-"))}}(),function(e){var n=w.className,t=Modernizr._config.classPrefix||"";if(x&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(e.length>0&&(n+=" "+t+e.join(" "+t)),x?w.className.baseVal=n:w.className=n)}(C),delete g.addTest,delete g.addAsyncTest;for(var T=0;T<Modernizr._q.length;T++)Modernizr._q[T]();e.Modernizr=Modernizr}(window,window,document);