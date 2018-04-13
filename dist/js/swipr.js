!function(e,t){"function"==typeof define&&define.amd?define([],function(){return t(e)}):"object"==typeof exports?module.exports=t(e):e.swipr=t(e)}("undefined"!=typeof global?global:"undefined"!=typeof window?window:this,function(c){"use strict";var d,u="querySelector"in document&&"addEventListener"in window&&"classList"in document.createElement("_"),v={wrapper:"[data-swipr-wrapper]",swiper:"[data-swipr]",swiprPreviousButtonClass:"swipr-prev",swiprPreviousButtonContent:"previous",swiprNextButtonClass:"swipr-next",swiprNextButtonContent:"next",disabledButtonClass:"is-disabled",amount:.8,speed:400,initiatedClass:"is-initiated",enabledClass:"is-enabled"};Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(this))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null});var f=function(){var n={},s=!1,e=0;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(s=arguments[0],e++);for(var t=function(e){for(var t in e)e.hasOwnProperty(t)&&(s&&"[object Object]"===Object.prototype.toString.call(e[t])?n[t]=f(n[t],e[t]):n[t]=e[t])};e<arguments.length;e++){t(arguments[e])}return n};function h(e){for(var t=e.previousSibling;null!=t&&3==t.nodeType;)t=t.previousSibling;return t}function b(e){for(var t=e.nextSibling;null!=t&&3==t.nodeType;)t=t.nextSibling;return t}return function(e){var p,m,t,s={},i=function(e){p&&(h(e).classList.contains(p.swiprPreviousButtonClass)&&(h(e).style.display="none"),b(e).classList.contains(p.swiprNextButtonClass)&&(b(e).style.display="none"))},o=function(e){var t=h(e),n=b(e);0<e.scrollLeft?(t.classList.remove(p.disabledButtonClass),t.removeAttribute("disabled")):(t.disabled=!0,t.classList.add(p.disabledButtonClass)),e.scrollWidth-e.scrollLeft==e.offsetWidth?(n.disabled=!0,n.classList.add(p.disabledButtonClass)):(n.classList.remove(p.disabledButtonClass),n.removeAttribute("disabled"))};function n(e,t){m=e.querySelector(p.swiper);var n,s,i,o,r,a,l,c,d=Math.round(e.offsetWidth*p.amount),u=m.scrollLeft;"prev"==t&&(n=u-d),"next"==t&&(n=u+d),s=m,i=n,o=p.speed,r=s.scrollLeft,a=i-r,l=0,(c=function(){l+=20;var e=Math.easeInOutQuad(l,r,a,o);s.scrollLeft=e,l<o&&setTimeout(c,20)})()}s.runswipr=function(e){var t=f(p||v,e||{});!function(e,t,n){if("[object Object]"===Object.prototype.toString.call(e))for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.call(n,e[s],s,e);else for(var i=0,o=e.length;i<o;i++)t.call(n,e[i],i,e)}(document.querySelectorAll(t.swiper),function(e){var t,n;!function(e){if(p&&!function(e){for(var t=e.firstChild;null!=t&&3==t.nodeType;)t=t.nextSibling;return t}(e.parentNode).classList.contains(p.swiprPreviousButtonClass)){var t=document.createElement("button"),n=document.createElement("button");t.classList.add(p.swiprPreviousButtonClass),t.innerHTML=p.swiprPreviousButtonContent,n.classList.add(p.swiprNextButtonClass),n.innerHTML=p.swiprNextButtonContent,e.parentNode.insertBefore(t,e),e.parentNode.insertBefore(n,e.nextSibling),t.addEventListener("click",r,!1),n.addEventListener("click",r,!1)}}(e),i(e),e.parentNode.classList.add(p.initiatedClass),e.scrollWidth>e.clientWidth?(s.enable(e),t=e,0!=(n=d)&&(t.style.marginBottom=-2*n+"px",t.style.paddingBottom=n+"px"),o(e)):s.disable(e)})},Math.easeInOutQuad=function(e,t,n,s){return(e/=s/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t};var r=function(){var e=this.className;e==p.swiprPreviousButtonClass&&n(this.parentNode,"prev"),e==p.swiprNextButtonClass&&n(this.parentNode,"next")},a=function(){o(this)},l=function(){t||(t=setTimeout(function(){t=null,s.runswipr(e)},66))};return s.enable=function(e){var t;p&&(t=e,p&&(h(t).classList.contains(p.swiprPreviousButtonClass)&&h(t).removeAttribute("style"),b(t).classList.contains(p.swiprNextButtonClass)&&b(t).removeAttribute("style")),e.parentNode.classList.add(p.enabledClass),e.addEventListener("scroll",a,!1))},s.disable=function(e){p&&(i(e),e.parentNode.classList.remove(p.enabledClass),e.removeAttribute("style"))},s.destroy=function(){p&&(c.removeEventListener("resize",l,!1),function(e){if(p){var t=e.parentNode.getElementsByClassName(p.swiprPreviousButtonClass)[0],n=e.parentNode.getElementsByClassName(p.swiprNextButtonClass)[0];t.removeEventListener("click",r,!1),n.removeEventListener("click",r,!1),t.parentNode.removeChild(t),n.parentNode.removeChild(n)}}(m),m.parentNode.classList.remove(p.initiatedClass),m.parentNode.classList.remove(p.enabledClass),d=t=m=p=null)},s.init=function(e){var t;u&&("ontouchstart"in document.documentElement&&((t=navigator.userAgent).match(/Android/i)||t.match(/webOS/i)||t.match(/iPhone/i)||t.match(/iPod/i)||t.match(/iPad/i)||t.match(/Windows Phone/i)||t.match(/SymbianOS/i)||t.match(/RIM/i)||t.match(/BB/i))||(p=f(v,e||{}),d=function(){var e=document.createElement("div");e.style.visibility="hidden",e.style.width="100px",e.style.msOverflowStyle="scrollbar",document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var n=document.createElement("div");n.style.width="100%",e.appendChild(n);var s=n.offsetWidth;return e.parentNode.removeChild(e),t!=s&&t-s}(),s.runswipr(e),c.addEventListener("resize",l,!1)))},s.init(e),s}});