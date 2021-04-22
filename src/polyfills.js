if (!Date.now) Date.now = function() { return new Date().getTime(); };

(function(w){
	var perfNow;
	var perfNowNames = ['now', 'webkitNow', 'msNow', 'mozNow'];
	if(!!w['performance']) for(var i = 0; i < perfNowNames.length; ++i)
	{
		var n = perfNowNames[i];
		if(!!w['performance'][n])
		{
			perfNow = function(){return w['performance'][n]()};
			break;
		}
	}
	if(!perfNow)
	{
		perfNow = Date.now;
	}
	w.perfNow = perfNow;
})(window);

function log(){ console.log.apply(console, arguments); }
if (!console.group) console.group = log;
if (!console.groupCollapsed) console.groupCollapsed = log;
if (!console.groupEnd) console.groupEnd = log;
if (!console.table) console.table = log;


(function() {
    'use strict';

    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
            || window[vp+'CancelRequestAnimationFrame']);
    }
    // iOS6 is buggy
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());

// Promise polyfill from https://github.com/MithrilJS/mithril.js/blob/next/promise/promise.js 
"use strict"
/** @constructor */
var PromisePolyfill = function(executor) {
    if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
        if (typeof executor !== "function") throw new TypeError("executor must be a function")

            var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
            var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
            var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
            function handler(list, shouldAbsorb) {
                return function execute(value) {
                    var then
                    try {
                        if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
                            if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
                                executeOnce(then.bind(value))
                        }
                        else {
                            callAsync(function() {
                                if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
                                    for (var i = 0; i < list.length; i++) list[i](value)
                                        resolvers.length = 0, rejectors.length = 0
                                instance.state = shouldAbsorb
                                instance.retry = function() {execute(value)}
                            })
                        }
                    }
                    catch (e) {
                        rejectCurrent(e)
                    }
                }
            }
            function executeOnce(then) {
                var runs = 0
                function run(fn) {
                    return function(value) {
                        if (runs++ > 0) return
                        fn(value)
                    }
                }
                var onerror = run(rejectCurrent)
                try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
            }

            executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
    var self = this, instance = self._instance
    function handle(callback, list, next, state) {
        list.push(function(value) {
            if (typeof callback !== "function") next(value)
                else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
        })
        if (typeof instance.retry === "function" && state === instance.state) instance.retry()
    }
var resolveNext, rejectNext
var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
    return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
    if (value instanceof PromisePolyfill) return value
    return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
    return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
        var total = list.length, count = 0, values = []
        if (list.length === 0) resolve([])
            else for (var i = 0; i < list.length; i++) {
                (function(i) {
                    function consume(value) {
                        count++
                            values[i] = value
                            if (count === total) resolve(values)
                    }
                if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
                    list[i].then(consume, reject)
                }
                else consume(list[i])
                })(i)
            }
    })
}
PromisePolyfill.race = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
        for (var i = 0; i < list.length; i++) {
            list[i].then(resolve, reject)
        }
    })
}

if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill

/**
 * Element.closest polyfill
 * For IE9 only
 * from https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#browser_compatibility
 **/
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
