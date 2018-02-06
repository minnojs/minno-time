!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("lodash"),require("minno-sequencer")):"function"==typeof define&&define.amd?define(["lodash","minno-sequencer"],t):e["minno-time"]=t(e._,e.Database)}(this,function(e,t){"use strict";function n(){console.log.apply(console,arguments)}function r(){return X}function i(e,t,n){var r=this.mixerSequence;switch(e){case"nextWhere":case"previousWhere":o("next",t,n,r);break;case"current":break;case"first":do{r.prev(n)}while(r.current(n));break;case"last":do{r.next(n)}while(r.current(n));r.prev();break;case"end":do{r.next(n)}while(r.current(n));break;case"next":r.next(n);break;default:throw new Error('Unknow destination "'+e+'" for goto.')}return this}function o(t,n,r,i){var o;do{i[t](),o=i.current(r)}while(o&&!e.callback(n)(o.data))}function a(e){return parseFloat(e,10)||0}function u(t,n){function r(){var r=function(t,n){var r=function(t){if(e.isPlainObject(t.proportions)){if("number"!=typeof t.proportions.height||"number"!=typeof t.proportions.width)throw new Error("The canvas proportions object`s height and a width properties must be numeric");return t.proportions.height/t.proportions.width}return t.proportions||.8}(t);if(t.width)return{width:t.width,height:t.width*r};var i=window.document.documentElement,o=i.clientHeight,u=Math.min(t.maxWidth,i.clientWidth,function(e){var t=window.getComputedStyle(e);return{height:a(e.offsetHeight)-a(t.borderTopWidth)-a(t.borderBottomWidth),width:a(e.offsetWidth)-a(t.borderLeftWidth)-a(t.borderRightWidth)}}(n.parentNode).width);return o>r*u?{height:u*r,width:u}:{height:o,width:o/r}}(n,t),i=window.getComputedStyle(t);r.height-=s(i.borderTopWidth)+s(i.borderBottomWidth)+s(i.marginTop),r.width-=s(i.borderLeftWidth)+s(i.borderRightWidth),t.style.width=r.width+"px",t.style.height=r.height+"px",t.style.fontSize=r.height*(n.textSize||3)/100+"px",window.scrollTo(0,1)}return e.throttle(function(e){"orientationchange"==e.type?setTimeout(r,500):r()},16)}function s(e){return parseFloat(e,10)||0}function c(t,n){var r;if(!e.isPlainObject(t))throw new Error("canvas(map): You must set a rule map for canvas to work properly");if(e.isUndefined(n))return e.noop;if(!e.isPlainObject(n))throw new Error("canvas(settings): canvas settings must be an object");return r=e.map(n,function(e,n){var r=t[n];if(r)return function(e,t,n){var r=e.style[t];return e.style[t]=n,function(){e.style[t]=r}}(r.element,r.property,e);throw new Error("canvas("+n+"): unknow key in canvas object.")}),function(){e.forEach(r,function(e){e.call()})}}function l(e,t){return t={exports:{}},e(t,t.exports),t.exports}function d(n,o){var a=function(t,n){n||(n={});var r=Q();if(!e.isElement(t))throw new Error("Minno-time: canvas is not a DOM element");t.classList.add("minno-canvas");var i=c({background:{element:document.body,property:"backgroundColor"},canvasBackground:{element:t,property:"backgroundColor"},borderColor:{element:t,property:"borderColor"},borderWidth:{element:t,property:"borderWidth"}},e.pick(n,["background","canvasBackground","borderColor","borderWidth"]));return n.css&&V(t,n.css),r.map(u(t,n)),r({}),window.addEventListener("orientationchange",r),window.addEventListener("resize",r),r.end.map(function(){t.classList.remove("minno-canvas")}).map(function(){window.removeEventListener("orientationchange",r),window.removeEventListener("resize",r)}).map(i),r}(n,e.get(o,"settings.canvas",{})),s=function(n){var r=new t;if(r.createColl("trial"),r.createColl("stimulus"),r.createColl("media"),r.add("trial",n.trialSets||[]),r.add("stimulus",n.stimulusSets||[]),r.add("media",n.mediaSets||[]),!e.isArray(n.sequence))throw new Error("You must set a sequence array.");var o=r.sequence("trial",n.sequence);return o.go=i,r.currentSequence=o,r}(o);return function(e){var t=r(r()),n=e.name||"anonymous minno-time",i=e.current?e.current:{};i.logs||(i.logs=[]),t[n]=t.current=i}(o),{db:s,$resize:a,canvas:n,script:o,settings:o.settings||{}}}function f(t,n,r){return"image"==r&&/^data:image/.test(n)?n:(e.isObject(t)&&(t=t[r]),t?"/"!=t[t.length-1]&&(t+="/"):t="",t+n)}function m(t,n){return function(t){var n=t.mediaSets,r=e.map(t.stimulusSets,p),i=e.map(t.trialSets,h),o=e.filter(t.sequence,v).map(h);return e.flattenDeep([n,r,i,o]).filter(w)}(t).forEach(function(t){e.isUndefined(t.image)||re.load(f(n,t.image,"image"),"image"),e.isUndefined(t.template)||re.load(f(n,t.template,"template"),"template")}),re}function h(t){return[e.map(t.input,function(e){return e.element}),e.map(t.stimuli,p),e.map(t.layout,p)]}function p(e){return e.media}function v(e){return!e.mixer}function w(t){return!e.isUndefined(t)}function g(e,t,n){var r=Q(),i=t.element;return i&&(V(i,t.css),ie.mutate(function(){n.appendChild(i)})),n.addEventListener(e,function(e){var n=e.target;return i&&n===i?r(e):i||n.getAttribute("data-handle")!==t.stimHandle?void 0:r(e)}),r.end.map(function(){i&&n.removeChild(i),n.removeEventListener(e,r)}),r}function y(e){function t(e){oe[e.which]||-1===r.indexOf(e.which)||(e.preventDefault(),oe[e.which]=!0,n(e))}var n=Q(),r=(Array.isArray(e.key)?e.key:[e.key]).map(function(e){return"string"==typeof e?e.toUpperCase().charCodeAt(0):e});return document.addEventListener("keydown",t),n.end.map(function(){document.removeEventListener("keydown",t)}),n}function b(t){var n,r=Q(),i=function(t,n){if(e.isArray(t))return t[Math.floor(Math.random()*t.length)];if(e.isFunction(t))return t.call(n);if(e.isPlainObject(t)){if(!e.isNumber(t.min)||!e.isNumber(t.max)||t.min>t.max)throw new Error("randomization objects need both a max and a minimum property, also max has to be larger than min");return t.min+(t.max-t.min)*Math.random()}return t}(t.duration)||0;return r.end.map(function(){clearTimeout(n)}),i?setTimeout(r.bind(null,{}),i):r({}),r}function E(t,n){function r(e,t){var n=document.createElement("div");return V(n,t),V(n,e),n}var i=t.on;switch(i){case"keypressed":return y(t);case"keyup":return function(e){var t=Q(),n=(Array.isArray(e.key)?e.key:[e.key]).map(function(e){return"string"==typeof e?e.toUpperCase().charCodeAt(0):e});return document.addEventListener("keyup",function(e){if(-1!==n.indexOf(e.which))return e.preventDefault(),t(e)}),t.end.map(function(){document.removeEventListener("keyup",t)}),t}(t);case"click":case"mousedown":return g("mousedown",t,n);case"mouseup":return g("mouseup",t,n);case"mouseenter":return g("mouseenter",t,n);case"mouseleave":return g("mouseleave",t,n);case"timeout":return b(t);case"enter":return y(e.assign({key:13},t));case"space":return y(e.assign({key:32},t));case"esc":return y(e.assign({key:27},t));case"leftTouch":return t.element=r(t.css,{position:"absolute",left:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),g("mousedown",t,n);case"rightTouch":return t.element=r(t.css,{position:"absolute",right:0,width:"30%",height:"100%",background:"#00FF00",opacity:.3}),g("mousedown",t,n);case"topTouch":return t.element=r(t.css,{position:"absolute",top:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),g("mousedown",t,n);case"bottomTouch":return t.element=r(t.css,{position:"absolute",bottom:0,width:"100%",height:"30%",background:"#00FF00",opacity:.3}),g("mousedown",t,n);default:throw new Error('You have an input element with an unrecognized "on" property: '+i)}}function _(t,n){var r=function(t,n){var r;if(e.isFunction(t))return t(t,n,Q);if(e.isPlainObject(t)){if(e.isString(t.on))return E(t,n);e.isFunction(t.on)&&(r=t.on(t,n,Q)),e.isFunction(t.off)&&r.end.map(t.off)}throw new Error("Input must only contain objects and functions, do you have an undefined value?")}(t,n);if(!function(e){return e._state}(r))throw new Error("Input functions must return valid streams: "+function(t){return e.isFunction(t)?t.toString():JSON.stringify(t)}(t));return"handle"in t&&(r.handle=t.handle),r}function x(t){var n,r=t.html||t.inlineTemplate||t.template;return e.isFunction(t)?function(t){var n=t();return function(t){return t&&e.isFunction(t.then)}(n)?n.then(function(t){return e.isElement(t)?t:Promise.reject("Custom media must resolve with an element")}):Promise.reject(new Error("Custom media must return a promise"))}(t):(e.isString(t)&&(t={word:t}),t.word?(n=document.createElement("div"),n.textContent=t.word,Promise.resolve(n)):r?(n=document.createElement("div"),n.innerHTML=r,Promise.resolve(n)):t.image?new Promise(function(e,r){(n=document.createElement("img")).onload=function(){e(n)},n.onerror=function(){r(new Error("Image not found: "+n.src))},n.src=t.image}):t.jquery?Promise.reject(new Error("Jquery is no longer supported in minno-time")):Promise.reject(new Error("Unrecognized media type")))}function k(t,n){var r=t.style,i=n.size||{};return i.font_size&&(r.fontSize=i.font_size),q("height",i)&&!function(t){return e.isString(t)||e.isString(t.word)}(n.media)&&(r.height=i.height+"%"),q("width",i)&&(r.width=i.width+"%"),t}function q(e,t){return e in t}function T(e,t){var n=t.location||{};("center"==n.top||"center"==n.bottom||void 0===n.top&&void 0===n.bottom)&&e.classList.add(ue),("center"==n.left||"center"==n.right||void 0===n.left&&void 0===n.right)&&e.classList.add(se),["top","bottom","left","right"].forEach(function(t){(function(e){return!isNaN(+e)})(n[t])&&(e.style[t]=n[t]+"%")})}function C(){var e=this.source,t=this.trial.$messages;if(!this.source.media)throw new Error("Media object not defined for "+this.name());return x(this.source.media).then(function(e,t){var n=this;return this.el=t,new Promise(function(r){ie.mutate(function(){t.classList.add("minno-stimulus"),t.setAttribute("data-handle",n.handle),k(t,n.source),T(t,n.source),V(t,n.source.css||{}),n.source.isLayout&&t.classList.add("minno-stimulus-visible"),e.appendChild(t),document.documentMode?function(e,t){var n=e.style,r=e.classList.contains(se),i=e.classList.contains(ue);if(!r&&!i)return t(e);ie.measure(function(){var t=window.getComputedStyle(e),o=parseFloat(t.width),a=parseFloat(t.height);ie.mutate(function(){n.transform="none",r&&(n.marginLeft="-"+o/2+"px"),i&&(n.marginTop="-"+a/2+"px")})})}(t,r):r(t)})})}.bind(this,this.canvas),function(n){throw t({type:"error",message:"trial.stimulus error",error:n,context:e}),n})}function P(){var e=this.el;if(!e)throw new Error("A stimulus can not be shown before init is called");ie.mutate(function(){e.classList.add("minno-stimulus-visible")})}function A(){var e=this.el;if(!e)throw new Error("A stimulus can not be hidden before init is called");ie.mutate(function(){e.classList.remove("minno-stimulus-visible")})}function S(){var e=this.el,t=this.canvas;ie.mutate(function(){t.removeChild(e)})}function F(){var e=this.source;return e.alias?e.alias:this.data.alias?this.data.alias:e.inherit&&e.inherit.set?e.inherit.set:this.handle?this.handle:void 0}function j(e){var t=this.source.media,n=e&&e.fullpath;if(t.alias)return t.alias;for(var r in t){if(O(["image","template"],r))return n?t[r]:t[r].replace(/^.*[\\/]/,"");if(O(["word","html","inlineTemplate"],r)&&t[r])return t[r]}}function O(e,t){return-1!=e.indexOf(t)}function L(t,n){function r(e){return function(e,t,n){var r={el:null,source:e,trial:t,canvas:n,init:C,show:P,hide:A,name:F,mediaName:j,destroy:S};return r.data=e.data||{},r.handle=r.data.handle=r.data.handle||e.handle||e.set,r}(e,t,n)}N("stimuli",t._source),N("layout",t._source);var i=t._source,o=e.map(i.stimuli,r),a=e.map(i.layout,function(e){return e.isLayout=!0,e}).map(r),u=Promise.all(o.concat(a).map(function(e){return e.init()}));return{canvas:n,stimuli:o,layout:a,ready:u,getStimlist:$,getMedialist:M,destroy:z}}function $(){return this.stimuli.filter(function(e){return!e.source.nolog}).map(function(e,t){return e.name()||"stim"+t})}function M(e){return this.stimuli.filter(function(e){return!e.source.nolog}).map(function(t,n){return t.mediaName(e)||"media"+n})}function z(){this.stimuli.concat(this.layout).forEach(function(e){e.destroy()})}function N(e,t){var n=t[e];if(n){if(!Array.isArray(n))throw new Error(e+" must be an array");if(!n.every(function(e){return"media"in e}))throw new Error("Each "+e+" stimulus must have a media property")}}function D(e,t){return t.stimulusCollection.stimuli.some(function(t){var n=t.data;for(var r in e)if(e[r]!==n[r])return!1;return!0})}function U(t,n,r){return t=Array.isArray(t)?t:[t],("begin"!=n.type||!t.every(function(e){return"begin"!=e.type}))&&t.every(function(t){return function(t){if(e.isFunction(t))return t;if(e.isFunction(le[t.type]))return le[t.type];throw new Error("Unknown condition type: "+JSON.stringify(t))}(t)(n,t,r)})}function W(t,n,r){var i=!1;return t=e.isArray(t)?t:[t],e.forEach(t,function(t){var o=e.isFunction(t)?t:de[t.type];if(!o)throw new Error("unknown action: "+t.type);"endTrial"===t.type&&(i=!0),o(t,n,r)}),i}function I(t){var n=0,r=t._source.interactions;try{!function(t){function n(t){return function(n){return Array.isArray(n[t])||e.isFunction(n[t])}}if(!Array.isArray(t))throw new Error("Interactions must be an array");if(!t.length)throw new Error("There are no interactions defined");if(!t.every(e.isPlainObject))throw new Error("Interactions must be plain objects");if(!t.every(n("conditions")))throw new Error("Conditions must be either an array or a function");if(!t.every(n("actions")))throw new Error("Actions must be either an array or a function")}(r)}catch(e){throw t.$messages({type:"error",message:"trial.interactions error",error:e,context:t._source}),e}return function(e){var i,o,a,u,s="Event: "+(e.handle||e.type),c=[];if(n>fe)throw new Error("It seem you have created an infinite loop. Minno has been halted");n++;try{for(i=0;i<r.length&&(o=r[i],a=U(o.conditions,e,t),c.push([a,o.conditions]),a&&(u=W(o.actions,e,t)),!u);i++);}catch(e){throw t.$messages({type:"error",message:"trial.interactions error",error:e}),e}return n--,t.$messages({type:"debug",message:s,rows:c}),u&&t.end(),e}}function R(t,n,r){if(!t.interactions)throw new Error("Interactions not defined");this.canvas=n,this.settings=r,this._source=t,this.$logs=Q(),this.$messages=Q(),this.$events=Q(),this.$end=this.$events.end,this.data=t.data||{},this._id=e.uniqueId("trial_"),this.counter=me++,this.input=function(e,t){var n=[],r=0;return{add:function(i){if(!i)throw new Error("Missing input element. Could not add input listener");var o=_(i,t);o.map(function(e){return{handle:o.handle,event:e,timestamp:+new Date,latency:ae()-r}}).map(e),n.push(o)},remove:function(e){for(var t=n.length-1;t>=0;t--){var r=n[t];r.handle===e&&(r.end(!0),n.splice(t,1))}},removeAll:function(){n.forEach(function(e){e.end(!0)}),n.length=0},resetTimer:function(){r=ae()}}}(this.$events,n),this.stimulusCollection=L(this,n),this._next=["next",{}]}function B(e,t){return new Promise(function(n,r){var i=new XMLHttpRequest;i.open("POST",e,!0),i.setRequestHeader("Content-Type","application/json; charset=UTF-8"),i.onreadystatechange=function(){4===this.readyState&&(this.status>=200&&this.status<400?n(this.responseText):r(new Error("Failed posting to: "+e)))},i.send(function(e){return"string"==typeof e?e:JSON.stringify(e)}(t))})}function G(t,n){function r(t){var r=(n.serialize||(n.newServelet?function(t,n){var r=e.assign({data:t},n);return JSON.stringify(r)}:function(e,t){var n="json="+JSON.stringify(e),r=function(e){var t,n=[];for(t in e)n.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return n.join("&").replace(/%20/g,"+")}(t);return n+(r?"&"+r:"")}))(t,n.metaData);return B(o,r).catch(function(){return B(o,r)}).catch(n.error||e.noop)}var i=[],o=n.url;o&&(t.map(function(e){i.push(e),n.pulse&&i.length>=n.pulse&&(r(i),i.length=0)}),t.end.map(function(){i.length&&r(i)}))}function H(t,n,r){var i=window.piGlobal,o=r.data,a=n,u=i.current.logs,s=e.get(r,"settings.logger.fullpath",!1),c=r.stimulusCollection.getStimlist(),l=r.stimulusCollection.getMedialist({fullpath:s});return{log_serial:u.length,trial_id:r.counter,name:r.name(),responseHandle:a.handle,latency:Math.floor(a.latency),stimuli:c,media:l,data:o}}function J(t){function n(t){var n=function(t,n,i){function o(r,i,o){var a=r[i];if(e.isUndefined(a))return!1;e.isString(a)&&(a={word:a}),(a=t.inflate("media",a,o)).image&&(a.image=f(n.base_url,a.image,"image")),a.template&&(a.inlineTemplate=requirejs("text!"+f(n.base_url,a.template,"template")),a.inlineTemplate=e.template(a.inlineTemplate)(o)),r[i]=a,o.mediaData=null,o.mediaMeta=null}function a(e){return e=t.inflate("stimulus",e,this,{skip:["media","touchMedia"]}),o(e,"media",this),o(e,"touchMedia",this),this.stimulusData=null,this.stimulusMeta=null,e}var u,s=i[0],c=i[1],l=t.currentSequence,d=r(),m={global:d,current:d.current};return l.go(s,c,m),(u=l.current(m,{skip:["layout","stimuli"]}))?(u.stimuli=e.map(u.stimuli||[],a,m),u.layout=e.map(u.layout||[],a,m),m.trialData=null,{value:u}):{done:!0}}(o,a,t);n.done?u.end(!0):u(n.value)}var i=t.canvas,o=t.db,a=t.settings,u=Q(),s=u.map(function(e){return function(t){var r=e,o=e=new R(t,i,a);return o.$logs.map(c),o.$messages.map(l),t.DEBUG&&window.DEBUG&&function(e){var t="Trial :"+e.counter;console.group(t),e.$messages.map(function(e){return"debug"!==e.type?e:(e.rows?(console.groupCollapsed(e.message),e.rows.forEach(function(e){console.log.apply(console,e)}),console.groupEnd(e.message)):console.log(e.message),e)}),e.$events.end.map(function(){console.groupEnd(t)})}(o),o.$end.map(function(){n(o._next)}),o.start(),r&&ie.mutate(function(){r.stimulusCollection.destroy()}),o}}()),c=Q(),l=Q(),d=function(e,t,n){var r=e.map(function(e){return function(t){return e.apply(null,t)}}(t.logger||t.logMap||n));return t.poster?t.poster(r,t,G):G(r,t),r}(c,function(t,n){var r=e.assign({},e.get(t,"settings.logger")),i=e.assign({taskName:t.name},n.$meta,r.metaData);return r.metaData=i,r}(t.script,r()),H);d.map(function(e){r().current.logs.push(e)});var m=e.get(a,"hooks.endTask",a.onEnd||e.noop);return u.end.map(function(){var e=s();e&&e.stimulusCollection.destroy()}).map(m),e.extend({$trial:s,end:u.end.bind(null,!0),$logs:d,$messages:l,start:n.bind(null,["next",{}]),onEnd:function(e){u.end.map(e)}},t)}e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,Date.now||(Date.now=function(){return(new Date).getTime()}),function(e){var t,n=["now","webkitNow","msNow","mozNow"];if(e.performance)for(var r=0;r<n.length;++r){var i=n[r];if(e.performance[i]){t=function(){return e.performance[i]()};break}}t||(t=Date.now),e.perfNow=t}(window),console.group||(console.group=n),console.groupCollapsed||(console.groupCollapsed=n),console.groupEnd||(console.groupEnd=n),console.table||(console.table=n),function(){for(var e=["webkit","moz"],t=0;t<e.length&&!window.requestAnimationFrame;++t){var n=e[t];window.requestAnimationFrame=window[n+"RequestAnimationFrame"],window.cancelAnimationFrame=window[n+"CancelAnimationFrame"]||window[n+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var r=0;window.requestAnimationFrame=function(e){var t=Date.now(),n=Math.max(r+16,t);return setTimeout(function(){e(r=n)},n-t)},window.cancelAnimationFrame=clearTimeout}}();var Y=function(e){function t(e,t){return function a(l){var d;try{if(!t||null==l||"object"!=typeof l&&"function"!=typeof l||"function"!=typeof(d=l.then))c(function(){t||0!==e.length||console.error("Possible unhandled promise rejection:",l);for(var n=0;n<e.length;n++)e[n](l);i.length=0,o.length=0,s.state=t,s.retry=function(){a(l)}});else{if(l===r)throw new TypeError("Promise can't be resolved w/ itself");n(d.bind(l))}}catch(e){u(e)}}}function n(e){function t(e){return function(t){n++>0||e(t)}}var n=0,r=t(u);try{e(t(a),r)}catch(e){r(e)}}if(!(this instanceof Y))throw new Error("Promise must be called with `new`");if("function"!=typeof e)throw new TypeError("executor must be a function");var r=this,i=[],o=[],a=t(i,!0),u=t(o,!1),s=r._instance={resolvers:i,rejectors:o},c="function"==typeof setImmediate?setImmediate:setTimeout;n(e)};Y.prototype.then=function(e,t){function n(e,t,n,a){t.push(function(t){if("function"!=typeof e)n(t);else try{r(e(t))}catch(e){i&&i(e)}}),"function"==typeof o.retry&&a===o.state&&o.retry()}var r,i,o=this._instance,a=new Y(function(e,t){r=e,i=t});return n(e,o.resolvers,r,!0),n(t,o.rejectors,i,!1),a},Y.prototype.catch=function(e){return this.then(null,e)},Y.resolve=function(e){return e instanceof Y?e:new Y(function(t){t(e)})},Y.reject=function(e){return new Y(function(t,n){n(e)})},Y.all=function(e){return new Y(function(t,n){var r=e.length,i=0,o=[];if(0===e.length)t([]);else for(var a=0;a<e.length;a++)!function(a){function u(e){i++,o[a]=e,i===r&&t(o)}null==e[a]||"object"!=typeof e[a]&&"function"!=typeof e[a]||"function"!=typeof e[a].then?u(e[a]):e[a].then(u,n)}(a)})},Y.race=function(e){return new Y(function(t,n){for(var r=0;r<e.length;r++)e[r].then(t,n)})},void 0===window.Promise&&(window.Promise=Y),function(e,t){if("undefined"==typeof document)return t;e=e||"";var n=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",n.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}(".minno-canvas{height:400px;width:500px;position:relative;border:5px solid #fff;margin:auto;margin-top:10px;-webkit-text-size-adjust:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.minno-stimulus{position:absolute;text-align:center;overflow:hidden;visibility:hidden;width:fit-content}.minno-stimulus-visible{visibility:visible}.minno-stimulus-center-x{left:50%;transform:translateX(-50%)}.minno-stimulus-center-y{top:50%;transform:translateY(-50%)}.minno-stimulus-center-y.minno-stimulus-center-x{transform:translate(-50%,-50%)}.minno-progress{background-color:#20201f;border-radius:20px;padding:4px;position:relative;top:50%;width:80%;margin-left:10%;margin-top:-12px}.minno-progress-bar{background-color:#807b7a;width:0;height:16px;border-radius:10px}",void 0);var X=window.piGlobal||(window.piGlobal={}),K="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},Q=l(function(e){!function(){function t(){function e(){return arguments.length>0&&arguments[0]!==w&&n(e,arguments[0]),e._state.value}return function(e){e.constructor=t,e._state={id:v++,value:void 0,state:0,derive:void 0,recover:void 0,deps:{},parents:[],endStream:void 0,unregister:void 0},e.map=e["fantasy-land/map"]=s,e["fantasy-land/ap"]=c,e["fantasy-land/of"]=t,e.valueOf=l,e.toJSON=d,e.toString=l,Object.defineProperties(e,{end:{get:function(){if(!e._state.endStream){var n=t();n.map(function(t){return!0===t&&(u(e),n._state.unregister=function(){u(n)}),t}),e._state.endStream=n}return e._state.endStream}}})}(e),arguments.length>0&&arguments[0]!==w&&n(e,arguments[0]),e}function n(e,t){r(e,t);for(var n in e._state.deps)i(e._state.deps[n],!1);null!=e._state.unregister&&e._state.unregister(),function(e){e._state.changed=!1;for(var t in e._state.deps)e._state.deps[t]._state.changed=!1}(e)}function r(e,t){e._state.value=t,e._state.changed=!0,2!==e._state.state&&(e._state.state=1)}function i(e,t){var n=e._state.parents;if(n.length>0&&n.every(m)&&(t||n.some(h))){var i=e._state.derive();if(i===w)return!1;r(e,i)}}function o(e,n){if(!n.every(f))throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream");return function(e,t,n){var r=e._state;return r.derive=n,r.parents=t.filter(p),a(e,r.parents),i(e,!0),e}(t(),n,function(){return e.apply(this,n.concat([n.filter(h)]))})}function a(e,t){for(var n=0;n<t.length;n++)t[n]._state.deps[e._state.id]=e,a(e,t[n]._state.parents)}function u(e){for(var t=0;t<e._state.parents.length;t++){delete e._state.parents[t]._state.deps[e._state.id]}for(var n in e._state.deps){var r=e._state.deps[n],i=r._state.parents.indexOf(e);i>-1&&r._state.parents.splice(i,1)}e._state.state=2,e._state.deps={}}function s(e){return o(function(t){return e(t())},[this])}function c(e){return o(function(e,t){return e()(t())},[e,this])}function l(){return this._state.value}function d(){return null!=this._state.value&&"function"==typeof this._state.value.toJSON?this._state.value.toJSON():this._state.value}function f(e){return e._state}function m(e){return 1===e._state.state}function h(e){return e._state.changed}function p(e){return 2!==e._state.state}var v=0,w={};t["fantasy-land/of"]=t,t.merge=function(e){return o(function(){return e.map(function(e){return e()})},e)},t.combine=o,t.scan=function(e,t,n){var r=o(function(n){return t=e(t,n._state.value)},[n]);return 0===r._state.state&&r(t),r},t.scanMerge=function(e,t){var n=e.map(function(e){var t=e[0];return 0===t._state.state&&t(void 0),t});return o(function(){var r=arguments[arguments.length-1];return n.forEach(function(n,i){r.indexOf(n)>-1&&(t=e[i][1](t,n._state.value))}),t},n)},t.HALT=w,e.exports=t}()}),V=function(e,t){var n=e.style;if(t)for(var r in t)n[r.replace(/-([a-z])/g,function(e){return e[1].toUpperCase()})]=t[r]},Z=[],ee=[],te=0,ne=e.memoize(function(e){return new Promise(function(t,n){var r=new XMLHttpRequest;r.open("GET",e,!0),r.onreadystatechange=function(){4===this.readyState&&(this.status>=200&&this.status<400?t(this.responseText):n(new Error("Template not found:"+e)))},r.send()})}),re={load:function(e,t){if(-1!==Z.indexOf(e))return!1;var n="template"==t?ne(e):function(e){return new Promise(function(t,n){var r=document.createElement("img");r.onload=function(){t(r)},r.onerror=function(){n(new Error("Image not found: "+e))},r.src=e})}(e);return n.then(function(){te++}).then(function(){re.onload&&re.onload()}),ee.push(n),Z.push(e),n},all:function(){return Promise.all(ee)},progress:function(){return ee.length?te/ee.length:1}},ie=l(function(e){!function(t){function n(){this.reads=[],this.writes=[],this.raf=u.bind(t)}function r(e){e.scheduled||(e.scheduled=!0,e.raf(function(e){var t,n=e.writes,o=e.reads;try{a("flushing reads",o.length),i(o),a("flushing writes",n.length),i(n)}catch(e){t=e}e.scheduled=!1,(o.length||n.length)&&r(e);if(t){if(a("task errored",t.message),!e.catch)throw t;e.catch(t)}}.bind(null,e)))}function i(e){for(var t;t=e.shift();)t()}function o(e,t){var n=e.indexOf(t);return!!~n&&!!e.splice(n,1)}var a=function(){},u=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.msRequestAnimationFrame||function(e){return setTimeout(e,16)};n.prototype={constructor:n,measure:function(e,t){var n=t?e.bind(t):e;return this.reads.push(n),r(this),n},mutate:function(e,t){var n=t?e.bind(t):e;return this.writes.push(n),r(this),n},clear:function(e){return o(this.reads,e)||o(this.writes,e)},extend:function(e){if("object"!=typeof e)throw new Error("expected object");var t=Object.create(this);return function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}(t,e),t.fastdom=this,t.initialize&&t.initialize(),t},catch:null};var s=t.fastdom=t.fastdom||new n;e.exports=s}("undefined"!=typeof window?window:K)}),oe=[];document.addEventListener("keyup",function(e){oe[e.which]=!1});var ae=window.performance.now?window.performance.now.bind(window.performance):Date.now.bind(Date),ue="minno-stimulus-center-y",se="minno-stimulus-center-x",ce=r(),le={begin:function(e){return"begin"===e.type},inputEquals:function(e,t){return-1!==(Array.isArray(t.value)?t.value:[t.value]).indexOf(e.handle)},inputEqualsTrial:function(e,t,n){return e.handle===n.data[t.property]},inputEqualsStim:function(e,t,n){var r={};return t.handle&&(r.handle=t.handle),r[t.property]=e.handle,D(r,n)},trialEquals:function(t,n,r){if(e.isUndefined(n.property)||e.isUndefined(n.value))throw new Error('trialEquals requires both "property" and "value" to be defined');return n.value===r.data[n.property]},inputEqualsGlobal:function(t,n){if(e.isUndefined(n.property))throw new Error('inputEqualsGlobal requires "property" to be defined');return t.handle===ce[n.property]},globalEquals:function(e,t){if(void 0===t.property||void 0===t.value)throw new Error('globalEquals requires both "property" and "value" to be defined');return t.value===ce[t.property]},globalEqualsTrial:function(e,t,n){if(void 0===t.globalProp||void 0===t.trialProp)throw new Error('globalEqualsTrial requires both "globalProp" and "trialProp" to be defined');return ce[t.globalProp]!==n.data[t.trialProp]},globalEqualsStim:function(e,t,n){if(void 0===t.globalProp||void 0===t.stimProp)throw new Error('globalEqualsStim requires both "globalProp" and "stimProp" to be defined');var r={};return t.handle&&(r.handle=t.handle),r[t.stimProp]=ce[t.globalProp],D(r,n)},currentEquals:function(e,t){var n=ce.current;if(void 0===t.property||void 0===t.value)throw new Error('currentEquals requires both "property" and "value" to be defined');return t.value!==n[t.property]},currentEqualsTrial:function(e,t,n){var r=ce.current;if(void 0===t.currentProp||void 0===t.trialProp)throw new Error('currentEqualsTrial requires both "currentProp" and "trialProp" to be defined');return r[t.currentProp]===n.data[t.trialProp]},currentEqualsStim:function(e,t,n){var r=ce.current;if(void 0===t.currentProp||void 0===t.stimProp)throw new Error('currentEqualsStim requires both "currentProp" and "stimProp" to be defined');var i={};return t.handle&&(i.handle=t.handle),i[t.stimProp]=r[t.currentProp],D(i,n)},inputEqualsCurrent:function(e,t){var n=ce.current;if(void 0===t.property)throw new Error('inputEqualsCurrent requires "property" to be defined');return e.handle===n[t.property]},fn:function(e,t,n){return t.value.apply(n,[t,e,n])},custom:function(e,t,n){return t.fn.apply(null,[t,e,n])}},de={showStim:function(e,t,n){var r=e.handle||e;n.stimulusCollection.stimuli.forEach(function(e){"All"!=r&&e.handle!=r||e.show()})},hideStim:function(e,t,n){var r=e.handle||e;n.stimulusCollection.stimuli.forEach(function(e){"All"!=r&&e.handle!=r||e.hide()})},setStimAttr:function(t,n,r){var i=t.handle,o=t.setter;r.stimulusCollection.stimuli.forEach(function(t){"All"!=i&&t.handle!=i||(e.isFunction(o)?o.apply(t):e.extend(t.data,o))})},setTrialAttr:function(t,n,r){var i=t.setter;if(void 0===i)throw new Error("The setTrialAttr action requires a setter property");e.isFunction(i)?i.apply(r,[r.data,n]):e.extend(r.data,i)},setInput:function(e,t,n){if(void 0===e.input)throw new Error("The setInput action requires an input property");n.input.add(e.input)},trigger:function(e,t,n){if(void 0===e.handle)throw new Error("The trigger action requires a handle property");n.input.add({handle:e.handle,on:"timeout",duration:+e.duration||0})},removeInput:function(t,n,r){var i=r.input,o=t.handle;if(void 0===o)throw new Error("The removeInput action requires a handle property");"All"==o||e.include(o,"All")?i.removeAll():i.remove(o)},goto:function(e,t,n){n._next=[e.destination,e.properties]},endTrial:function(){},resetTimer:function(e,t,n){function r(){t.latency=0,n.input.resetTimer()}e.immidiate?r():ie.mutate(r)},log:function(e,t,n){n.$logs(arguments)},setGlobalAttr:function(t){switch(typeof t.setter){case"function":t.setter.apply(null,[r(),t]);break;case"object":e.extend(r(),t.setter);break;default:throw new Error('setGlobalAttr requires a "setter" property')}},custom:function(e,t,n){if("function"!=typeof e.fn)throw new Error("The custom action requires a fn propery");e.fn(e,t,n)},canvas:function(t,n,r){var i=r.cavnas,o=c({background:{element:document.body,property:"backgroundColor"},canvasBackground:{element:i,property:"backgroundColor"},borderColor:{element:i,property:"borderColor"},borderWidth:{element:i,property:"borderWidth"}},e.pick(t,["background","canvasBackground","borderColor","borderWidth"]));r.$end.map(o)}},fe=50,me=0;return e.extend(R.prototype,{start:function(){var t=this;return t.stimulusCollection.ready.then(function(){t.$events.map(function(t){return function(n){return e.assign(n,{trialId:t._id,counter:t.counter})}}(t)).map(I(t)),e.forEach(t._source.input,t.input.add),t.input.resetTimer(),t.$events({type:"begin",latency:0})})},end:function(){this.input.removeAll(),this.$end(!0)},name:function(){return this.alias?this.alias:this.data.alias?this.data.alias:e.isString(this._source.inherit)?this._source.inherit:e.isPlainObject(this._source.inherit)?this._source.inherit.set:void 0}}),function(e,t){var n=J(d(e,t));return n.$trial.end.map(n.$resize.end.bind(null,!0)),function(e,n){function r(){for(;e.firstChild;)e.removeChild(e.firstChild)}var i=m(t,t.base_url);if(1==i.progress())return Promise.resolve().then(r);e.innerHTML='<div class="minno-progress"><div class="minno-progress-bar"></div></div>';var o=e.getElementsByClassName("minno-progress-bar")[0].style;return o.width=i.progress()+"%",i.onload=function(){ie.mutate(function(){o.width=100*i.progress()+"%"})},i.all().then(r).catch(function(e){throw new Error("loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - "+e+")")})}(e).then(n.start),n}});
//# sourceMappingURL=time.js.map
