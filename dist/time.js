(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('lodash'), require('minno-sequencer')) :
	typeof define === 'function' && define.amd ? define(['lodash', 'minno-sequencer'], factory) :
	(global['minno-time'] = factory(global._,global.Database));
}(this, (function (_,Database) { 'use strict';

_ = _ && _.hasOwnProperty('default') ? _['default'] : _;
Database = Database && Database.hasOwnProperty('default') ? Database['default'] : Database;

if (!Date.now) Date.now = function() { return new Date().getTime(); };

function log(){ console.log.apply(console, arguments); }
if (!console.group) console.group = log;
if (!console.groupCollapsed) console.groupCollapsed = log;
if (!console.groupEnd) console.groupEnd = log;
if (!console.table) console.table = log;


(function() {
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
var PromisePolyfill = function(executor) {
    if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
        if (typeof executor !== "function") throw new TypeError("executor must be a function")

            var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false);
            var instance = self._instance = {resolvers: resolvers, rejectors: rejectors};
            var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout;
            function handler(list, shouldAbsorb) {
                return function execute(value) {
                    var then;
                    try {
                        if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
                            if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
                                executeOnce(then.bind(value));
                        }
                        else {
                            callAsync(function() {
                                if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value);
                                    for (var i = 0; i < list.length; i++) list[i](value);
                                        resolvers.length = 0, rejectors.length = 0;
                                instance.state = shouldAbsorb;
                                instance.retry = function() {execute(value);};
                            });
                        }
                    }
                    catch (e) {
                        rejectCurrent(e);
                    }
                }
            }
            function executeOnce(then) {
                var runs = 0;
                function run(fn) {
                    return function(value) {
                        if (runs++ > 0) return
                        fn(value);
                    }
                }
                var onerror = run(rejectCurrent);
                try {then(run(resolveCurrent), onerror);} catch (e) {onerror(e);}
            }

            executeOnce(executor);
};
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
    var self = this, instance = self._instance;
    function handle(callback, list, next, state) {
        list.push(function(value) {
            if (typeof callback !== "function") next(value);
                else try {resolveNext(callback(value));} catch (e) {if (rejectNext) rejectNext(e);}
        });
        if (typeof instance.retry === "function" && state === instance.state) instance.retry();
    }
var resolveNext, rejectNext;
var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject;});
handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false);
return promise
};
PromisePolyfill.prototype.catch = function(onRejection) {
    return this.then(null, onRejection)
};
PromisePolyfill.resolve = function(value) {
    if (value instanceof PromisePolyfill) return value
    return new PromisePolyfill(function(resolve) {resolve(value);})
};
PromisePolyfill.reject = function(value) {
    return new PromisePolyfill(function(resolve, reject) {reject(value);})
};
PromisePolyfill.all = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
        var total = list.length, count = 0, values = [];
        if (list.length === 0) resolve([]);
            else for (var i = 0; i < list.length; i++) {
                (function(i) {
                    function consume(value) {
                        count++;
                            values[i] = value;
                            if (count === total) resolve(values);
                    }
                if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
                    list[i].then(consume, reject);
                }
                else consume(list[i]);
                })(i);
            }
    })
};
PromisePolyfill.race = function(list) {
    return new PromisePolyfill(function(resolve, reject) {
        for (var i = 0; i < list.length; i++) {
            list[i].then(resolve, reject);
        }
    })
};

if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill;

var glob = window.piGlobal || (window.piGlobal = {});

function global$2(){
    return glob;
}

/**
 * Go to a destination within the sequence (must be a property of a sequence)
 * @param  {String} target destination type
 * @param  {Object} properties destination options
 * @return {Object}        result element
 */

function go$1(destination, properties, context){
    var mixerSequence = this.mixerSequence;

    switch (destination){
        case 'nextWhere':
            where('next', properties, context, mixerSequence);
            break;
        case 'previousWhere':
            where('next', properties, context, mixerSequence);
            break;
        case 'current':
            // don't need to do anything...
            break;
        case 'first':
            do {mixerSequence.prev(context);} while (mixerSequence.current(context));
            break;
        case 'last':
            do {mixerSequence.next(context);} while (mixerSequence.current(context));
            mixerSequence.prev();
            break;
        case 'end':
            do {mixerSequence.next(context);} while (mixerSequence.current(context));
            break;
        case 'next' :
            mixerSequence.next(context); // get the next trial, in case there are no more trials, returns undefined
            break;
        default:
            throw new Error('Unknow destination "' + destination + '" for goto.');
    }

    return this;
}

function where(direction, properties, context, sequence){
    var curr;

    do {
        sequence[direction]();
        curr = sequence.current(context);
    } while (curr && !_.callback(properties)(curr.data));
}

/*
 * this file is resposible for taking the experiment script (json) and parsing it
 */

// load dependancies
function createDB$1(script){
    var db = new Database();
    db.createColl('trial');
    db.createColl('stimulus');
    db.createColl('media');

    db.add('trial', script.trialSets || []);
    db.add('stimulus', script.stimulusSets || []);
    db.add('media', script.mediaSets || []);

    if (!_.isArray(script.sequence)) throw new Error('You must set a sequence array.');

    var sequence = db.sequence('trial', script.sequence);
    sequence.go = go$1; // see sequence/goto.js to understand why we are doing this
    db.currentSequence = sequence;
    return db;
}

function getSize$1(el){
    var computedStyle = window.getComputedStyle(el);
    return {
        height    : parse$1(el.offsetHeight) - parse$1(computedStyle.borderTopWidth) - parse$1(computedStyle.borderBottomWidth),
        width    : parse$1(el.offsetWidth) - parse$1(computedStyle.borderLeftWidth) - parse$1(computedStyle.borderRightWidth)
    };
}

function parse$1(num){ return parseFloat(num, 10) || 0;}

/*
 * adjust canvas according to window size and settings
 * this module is built to be part of the main view
 */

function adjust_canvas(canvas, settings){

    return _.throttle(eventListener, 16);

    function eventListener(event){
        // we put this in a time out because of a latency of orientation change on android devices
        if (event.type == 'orientationchange') setTimeout(resize, 500);
        else resize();
    }

    function resize(){
        var targetSize = getTargetSize(settings, canvas);

        // remove border width and top margin from calculated width (can't depend on cool box styles yet...)
        // we compute only margin-top because of a difference calculating margins between chrome + IE and firefox + mobile
        var computedStyle = window.getComputedStyle(canvas);
        targetSize.height -= parse(computedStyle.borderTopWidth) + parse(computedStyle.borderBottomWidth) + parse(computedStyle.marginTop);
        targetSize.width -= parse(computedStyle.borderLeftWidth) + parse(computedStyle.borderRightWidth);

        // reset canvas size
        canvas.style.width = targetSize.width + 'px';
        canvas.style.height = targetSize.height + 'px';
        canvas.style.fontSize = targetSize.height*(settings.textSize || 3)/100 + 'px';

        // scroll to top of window (hides some of the mess on the top of mobile devices)
        window.scrollTo(0, 1);
    }
}

function getProportions(settings){
    // if proportions are an object they should include width and height
    if (_.isPlainObject(settings.proportions)) {
        if (typeof settings.proportions.height !== 'number' || typeof settings.proportions.width !== 'number'){
            throw new Error('The canvas proportions object`s height and a width properties must be numeric');
        }
        return settings.proportions.height/settings.proportions.width; 
    } 
    return settings.proportions || 0.8; // by default proportions are 0.8
}

function getTargetSize(settings, canvas){
    // calculate proportions (as height/width)
    var proportions = getProportions(settings);

    // static canvas size
    // ------------------
    if (settings.width) return {
        width: settings.width,
        height: settings.width*proportions
    };

    // dynamic canvas size
    // -------------------

    var docElement = window.document.documentElement; // used to get client view size

    var maxHeight = docElement.clientHeight;
    var maxWidth = Math.min(settings.maxWidth, docElement.clientWidth, getSize$1(canvas.parentNode).width);

    // calculate the correct size for this screen size
    if (maxHeight > proportions * maxWidth) return { height: maxWidth*proportions, width: maxWidth };
    else return { height: maxHeight, width: maxHeight/proportions};
}

function parse(num){ return parseFloat(num, 10) || 0;}

/**
 *
 * This whole module taken from piManager
 *
 */

function canvasContructor(map, settings){
    var offArr;

    if (!_.isPlainObject(map)) throw new Error('canvas(map): You must set a rule map for canvas to work properly');

    // if settings is undefined return a function that doesn't do anything
    // just so we don't need to make sure that the user modifies the canvas
    if (_.isUndefined(settings)) return _.noop;
    if (!_.isPlainObject(settings)) throw new Error('canvas(settings): canvas settings must be an object');

    // create an array of off functions to undo any changes by this action
    offArr = _.map(settings, function(value,key){
        var rule = map[key];
        if (rule) return on(rule.element, rule.property, value);
        throw new Error('canvas('+ key +'): unknow key in canvas object.');
    });

    return function off(){
        _.forEach(offArr, function(fn){fn.call();});
    };
}

function on(el, property, value){
    var old = el.style[property]; // save old value
    el.style[property] = value; // set new value
    return function(){el.style[property] = old;};  // create off function
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var stream = createCommonjsModule(function (module) {
/* eslint-disable */
(function() {
var guid = 0, HALT = {};
function createStream() {
	function stream() {
		if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);
		return stream._state.value
	}
	initStream(stream);

	if (arguments.length > 0 && arguments[0] !== HALT) updateStream(stream, arguments[0]);

	return stream
}
function initStream(stream) {
	stream.constructor = createStream;
	stream._state = {id: guid++, value: undefined, state: 0, derive: undefined, recover: undefined, deps: {}, parents: [], endStream: undefined, unregister: undefined};
	stream.map = stream["fantasy-land/map"] = map, stream["fantasy-land/ap"] = ap, stream["fantasy-land/of"] = createStream;
	stream.valueOf = valueOf, stream.toJSON = toJSON, stream.toString = valueOf;

	Object.defineProperties(stream, {
		end: {get: function() {
			if (!stream._state.endStream) {
				var endStream = createStream();
				endStream.map(function(value) {
					if (value === true) {
						unregisterStream(stream);
						endStream._state.unregister = function(){unregisterStream(endStream);};
					}
					return value
				});
				stream._state.endStream = endStream;
			}
			return stream._state.endStream
		}}
	});
}
function updateStream(stream, value) {
	updateState(stream, value);
	for (var id in stream._state.deps) updateDependency(stream._state.deps[id], false);
	if (stream._state.unregister != null) stream._state.unregister();
	finalize(stream);
}
function updateState(stream, value) {
	stream._state.value = value;
	stream._state.changed = true;
	if (stream._state.state !== 2) stream._state.state = 1;
}
function updateDependency(stream, mustSync) {
	var state = stream._state, parents = state.parents;
	if (parents.length > 0 && parents.every(active) && (mustSync || parents.some(changed))) {
		var value = stream._state.derive();
		if (value === HALT) return false
		updateState(stream, value);
	}
}
function finalize(stream) {
	stream._state.changed = false;
	for (var id in stream._state.deps) stream._state.deps[id]._state.changed = false;
}

function combine(fn, streams) {
	if (!streams.every(valid)) throw new Error("Ensure that each item passed to stream.combine/stream.merge is a stream")
	return initDependency(createStream(), streams, function() {
		return fn.apply(this, streams.concat([streams.filter(changed)]))
	})
}

function initDependency(dep, streams, derive) {
	var state = dep._state;
	state.derive = derive;
	state.parents = streams.filter(notEnded);

	registerDependency(dep, state.parents);
	updateDependency(dep, true);

	return dep
}
function registerDependency(stream, parents) {
	for (var i = 0; i < parents.length; i++) {
		parents[i]._state.deps[stream._state.id] = stream;
		registerDependency(stream, parents[i]._state.parents);
	}
}
function unregisterStream(stream) {
	for (var i = 0; i < stream._state.parents.length; i++) {
		var parent = stream._state.parents[i];
		delete parent._state.deps[stream._state.id];
	}
	for (var id in stream._state.deps) {
		var dependent = stream._state.deps[id];
		var index = dependent._state.parents.indexOf(stream);
		if (index > -1) dependent._state.parents.splice(index, 1);
	}
	stream._state.state = 2; //ended
	stream._state.deps = {};
}

function map(fn) {return combine(function(stream) {return fn(stream())}, [this])}
function ap(stream) {return combine(function(s1, s2) {return s1()(s2())}, [stream, this])}
function valueOf() {return this._state.value}
function toJSON() {return this._state.value != null && typeof this._state.value.toJSON === "function" ? this._state.value.toJSON() : this._state.value}

function valid(stream) {return stream._state }
function active(stream) {return stream._state.state === 1}
function changed(stream) {return stream._state.changed}
function notEnded(stream) {return stream._state.state !== 2}

function merge(streams) {
	return combine(function() {
		return streams.map(function(s) {return s()})
	}, streams)
}

function scan(reducer, seed, stream) {
	var newStream = combine(function (s) {
		return seed = reducer(seed, s._state.value)
	}, [stream]);

	if (newStream._state.state === 0) newStream(seed);

	return newStream
}

function scanMerge(tuples, seed) {
	var streams = tuples.map(function(tuple) {
		var stream = tuple[0];
		if (stream._state.state === 0) stream(undefined);
		return stream
	});

	var newStream = combine(function() {
		var changed = arguments[arguments.length - 1];

		streams.forEach(function(stream, idx) {
			if (changed.indexOf(stream) > -1) {
				seed = tuples[idx][1](seed, stream._state.value);
			}
		});

		return seed
	}, streams);

	return newStream
}

createStream["fantasy-land/of"] = createStream;
createStream.merge = merge;
createStream.combine = combine;
createStream.scan = scan;
createStream.scanMerge = scanMerge;
createStream.HALT = HALT;

module["exports"] = createStream;

}());
});

var css_1 = css;

/**
 * @arg el DOMElement any dom element
 * @arg obj Object a hash of styleName:value, where the style name may be either css-style or jsStyle (camelCase)
 * @returns void
 *
 * The function applies the styles set in obj to the el
 **/

function css(el, obj){
    var style = el.style;

    if (!obj) return;

    for (var key in obj) style[camelCase(key)] = obj[key];

    function camelCase(str){ 
        return  str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); 
    }
}

function setupCanvas(canvas, canvasSettings){
    canvasSettings || (canvasSettings = {});
    var $resize = stream();

    if (!_.isElement(canvas)) throw new Error('Minno-time: canvas is not a DOM element');

    canvas.classList.add('minno-canvas');

    // apply canvas styles
    var map = {
        background 			: {element: document.body, property: 'backgroundColor'},
        canvasBackground	: {element: canvas, property:'backgroundColor'},
        borderColor			: {element: canvas, property:'borderColor'},
        borderWidth			: {element: canvas, property:'borderWidth'}
    };

    var off = canvasContructor(map, _.pick(canvasSettings,['background','canvasBackground','borderColor','borderWidth']));

    canvasSettings.css && css_1(canvas, canvasSettings.css);

    // setup canvas resize
    $resize.map(adjust_canvas(canvas, canvasSettings));
    $resize({});

    window.addEventListener('orientationchange', $resize);
    window.addEventListener('resize', $resize);

    $resize.end
        .map(function(){canvas.classList.remove('minno-canvas');})
        .map(function removeListeners(){
            window.removeEventListener('orientationchange',$resize);
            window.removeEventListener('resize', $resize);
        })
        .map(off);



    return $resize;

}

function setup$1(canvas, script){
    var $resize = setupCanvas(canvas, _.get(script, 'settings.canvas', {}));
    var db = createDB$1(script);
    setupVars(script);

    return {
        db:db, 
        $resize:$resize,
        canvas: canvas,
        script: script,
        settings: script.settings || {}
    };
}

function setupVars(script){
    // init global
    var glob = global$2(global$2());
    var name = script.name || 'anonymous minno-time';
    var current = script.current ? script.current : {};

    current.logs || (current.logs = []); // init logs object
    glob[name] = glob.current = current; // create local namespace
}

/*
 * media preloader
 * TODO: turn into factory, possibly make progress into a stream.
 */
var srcStack = [];				// an array holding all our sources
var defStack = [];				// an array holding all the deferreds
var stackDone = 0;				// the number of sources we have completed downloading
var loader = {
    // loads a single source
    load: load,

    all: function(){
        return Promise.all(defStack);
    },

    progress: function(){
        return defStack.length ? stackDone/defStack.length : 1;
    }
};

// load a single source
function load(src, type){
    var promise;
    type = type || 'image';
    // the source was already loaded
    if (srcStack.indexOf(src) !== -1) return false;

    // if we haven't loaded this yet
    switch (type) {
        case 'template':
            promise = new Promise(function(resolve, reject){
                // @TODO: get rid of requirejs dependency
                requirejs(['text!' + src], resolve, function(){
                    reject(new Error('Template not found: ' + src));
                });
            });
            break;
        case 'image':
            /* falls through */
        default :
            promise = new Promise(function(resolve, reject){
                var el = document.createElement('img');
                el.onload = function(){resolve(el);};
                el.onerror = function(){reject(new Error('Image not found: ' + el.src ));};
                el.src = src;
                
            });
            break;
    }

    promise
        .then(function(){stackDone++;})
        .then(function(){
            loader.onload && loader.onload();
        });

    // keep defered and source for later.
    defStack.push(promise);
    srcStack.push(src);

    return promise;
}

/*
 * build the url for this src (add the generic baseUrl)
 * @Todo: pass in the baseUrl (drop global settings, pass them through the sink).
 */

function buildUrl(baseUrl, url, type){
    // it this is a dataUrl type of image, we don't need to append the baseurl
    if (type == 'image' && /^data:image/.test(url)) return url;

    // the base url setting may be either a string, or an object with the type as a field
    if (_.isObject(baseUrl)) baseUrl = baseUrl[type];

    // make sure base url is set, and add trailing slash if needed
    if (!baseUrl) baseUrl = '';
    else if (baseUrl[baseUrl.length-1] != '/') baseUrl += '/';

    return baseUrl + url;
}

/*
 * gets all media that needs preloading and preloads it
 */

function preloadScript(script, baseUrl){
    getScriptMedia(script).forEach(loadMedia);
    return loader;

    function loadMedia(media){
        if (!_.isUndefined(media.image)) loader.load(buildUrl(baseUrl, media.image, 'image'),'image');
        if (!_.isUndefined(media.template)) loader.load(buildUrl(baseUrl, media.template,'template'),'template');
    }
}

/**
 * Iterates over a script and gathers all media
 **/
function getScriptMedia(script){
    var mediaSets = script.mediaSets;
    var stimulusSets = _.map(script.stimulusSets, getStimMedia);
    var trialSets = _.map(script.trialSets, getTrialMedia);
    var sequence = _.filter(script.sequence,notMixer).map(getTrialMedia);

    return _.flattenDeep([mediaSets, stimulusSets, trialSets, sequence]).filter(notUndefined);
} 

function getTrialMedia(trial){
    return [
        _.map(trial.input, function(input){ return input.element; }),
        _.map(trial.stimuli, getStimMedia),
        _.map(trial.layout, getStimMedia)
    ];
}

function getStimMedia(stim){ return stim.media; }
function notMixer(trial){ return !trial.mixer; }
function notUndefined(val){ return !_.isUndefined(val); }

var fastdom = createCommonjsModule(function (module) {
!(function(win) {

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 * @author Kornel Lesinski <kornel.lesinski@ft.com>
 */

var debug = function() {};

/**
 * Normalized rAF
 *
 * @type {Function}
 */
var raf = win.requestAnimationFrame
  || win.webkitRequestAnimationFrame
  || win.mozRequestAnimationFrame
  || win.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
  var self = this;
  self.reads = [];
  self.writes = [];
  self.raf = raf.bind(win); // test hook
  
}

FastDom.prototype = {
  constructor: FastDom,

  /**
   * Adds a job to the read batch and
   * schedules a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  measure: function(fn, ctx) {
    var task = !ctx ? fn : fn.bind(ctx);
    this.reads.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  mutate: function(fn, ctx) {
    var task = !ctx ? fn : fn.bind(ctx);
    this.writes.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Clears a scheduled 'read' or 'write' task.
   *
   * @param {Object} task
   * @return {Boolean} success
   * @public
   */
  clear: function(task) {
    return remove(this.reads, task) || remove(this.writes, task);
  },

  /**
   * Extend this FastDom with some
   * custom functionality.
   *
   * Because fastdom must *always* be a
   * singleton, we're actually extending
   * the fastdom instance. This means tasks
   * scheduled by an extension still enter
   * fastdom's global task queue.
   *
   * The 'super' instance can be accessed
   * from `this.fastdom`.
   *
   * @example
   *
   * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
   *
   * @param  {Object} props  properties to mixin
   * @return {FastDom}
   */
  extend: function(props) {
    if (typeof props != 'object') throw new Error('expected object');

    var child = Object.create(this);
    mixin(child, props);
    child.fastdom = this;

    // run optional creation hook
    if (child.initialize) child.initialize();

    return child;
  },

  // override this with a function
  // to prevent Errors in console
  // when tasks throw
  catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
  if (!fastdom.scheduled) {
    fastdom.scheduled = true;
    fastdom.raf(flush.bind(null, fastdom));
    
  }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {
  var writes = fastdom.writes;
  var reads = fastdom.reads;
  var error;

  try {
    debug('flushing reads', reads.length);
    runTasks(reads);
    debug('flushing writes', writes.length);
    runTasks(writes);
  } catch (e) { error = e; }

  fastdom.scheduled = false;

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush(fastdom);

  if (error) {
    debug('task errored', error.message);
    if (fastdom.catch) fastdom.catch(error);
    else throw error;
  }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
  var task; while (task = tasks.shift()) task();
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
  var index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
}

// There should never be more than
// one instance of `FastDom` in an app
var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

// Expose to CJS & AMD
if ((typeof undefined) == 'function') undefined(function() { return exports; });
else module.exports = exports;

})( typeof window !== 'undefined' ? window : commonjsGlobal);
});

function preloadPhase$1(canvas, script){
    var preloader = preloadScript(script, script.base_url);

    if (preloader.progress() == 1) return Promise.resolve().then(emptyCanvas);

    canvas.innerHTML = '<div class="minno-progress"><div class="minno-progress-bar"></div></div>';

    var barStyle = canvas.getElementsByClassName('minno-progress-bar')[0].style;
    barStyle.width = preloader.progress() + '%';
    preloader.onload = function(){
        fastdom.mutate(function(){
            barStyle.width = preloader.progress()*100 + '%';
        });
    };

    return preloader.all()
        .then(emptyCanvas)['catch'](function(src){
            throw new Error('loading resource failed, do something about it! (you can start by checking the error log, you are probably reffering to the wrong url - ' + src +')');
        });

    function emptyCanvas(){
        while (canvas.firstChild) canvas.removeChild(canvas.firstChild);
    }
}

function mouseEvents$1(eventName, $listener,inputObj, canvas){
    var element = inputObj.element;

    if (element){
        css_1(element, inputObj.css);
        fastdom.mutate(function(){
            canvas.appendChild(element);
        });
    }

    canvas.addEventListener(eventName, clickListener);

    $listener.end.map(removeClickListener);
    return $listener;

    function clickListener(e){
        var target = e.target;
        if (element && target === element) return $listener(e);
        if (!element && target.getAttribute('data-handle') === inputObj.stimHandle) return $listener(e);
        return;
    }

    function removeClickListener(){
        if (element) canvas.removeChild(element);
        canvas.removeEventListener(eventName, $listener);
    }
}

/*
* key pressed listener
* reqires key
*
* key can be either charCode or string.
* or an array of charCode/strings.
*/

// we monitor all key up events so that we trigger only once per key down
var keyDownArr = [];

document.addEventListener('keyup',function(e){ keyDownArr[e.which] = false; });// unset flag to prevent multi pressing of a key 

function keypressed$1($listener,inputObj){
    // make sure key is an array
    var keys = Array.isArray(inputObj.key) ? inputObj.key : [inputObj.key];

    // map keys to keyCodes
    var target = keys.map(function(value){ 
        return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; 
    });

    document.addEventListener('keydown', keypressListener);

    $listener.end.map(removeKeypressListener);
    return $listener;

    function keypressListener(e){
        if (keyDownArr[e.which] || (target.indexOf(e.which) === -1)) return;
        e.preventDefault(); // prevent FF from wasting about 10ms in browser-content.js (and fast search)
        keyDownArr[e.which] = true; // set flag to prevent multi pressing of a key
        $listener(e);
    }

    function removeKeypressListener(){
        document.removeEventListener('keydown', keypressListener);
    }
}

function keyup$1($listener,inputObj){
    // make sure key is array
    var keys = Array.isArray(inputObj.key) ? inputObj.key : [inputObj.key];

    // map keys to keyCodes
    var target = keys.map(function(value){ 
        return typeof value == 'string' ? value.toUpperCase().charCodeAt(0) : value; 
    });

    document.addEventListener('keyup', keypressListener);

    $listener.end.map(removeKeypressListener);
    return $listener;

    function keypressListener(e){
        if (target.indexOf(e.which) === -1) return;
        e.preventDefault();
        return $listener(e);
    }

    function removeKeypressListener(){
        document.removeEventListener('keyup', $listener);
    }
}

/**
 *	Takes a properties objects and returns the result of a randomization:
 *	If it is an array - pick a random member
 *	If it is an object pick from within a range
 *	If it is a function return its result using the context
 *	Otherwise simply return the properties
 */
function simpleRandomize(properties, context){

    if (_.isArray(properties)) {
        var index = Math.floor(Math.random()*properties.length);
        return properties[index];
    }

    if (_.isFunction(properties)) {
        return properties.call(context);
    }

    // this must be after the test for arrays and functions, because they are considered objects too
    if (_.isPlainObject(properties)) {
        if (!_.isNumber(properties.min) || !_.isNumber(properties.max) || properties.min > properties.max) {
            throw new Error('randomization objects need both a max and a minimum property, also max has to be larger than min');
        }
        return properties.min + (properties.max - properties.min) * Math.random();
    }

    // if this is not a randomization object simply return
    return properties;
}

function timeout$1($listener, inputObj){
    var timeoutID;
    var duration = simpleRandomize(inputObj.duration) || 0;

    $listener.end.map(cancel);

    if (duration) setTimeout($listener.bind(null, {}), duration);
    else $listener({}); // listener is already registered with $events so this should be immidiate

    return $listener;

    function cancel(){
        clearTimeout(timeoutID);
    }
}

function inputBinder($listener, inputObj, canvas){
    var on = inputObj.on; // what type of binding is this?

    switch (on){

        case 'keypressed'	: return keypressed$1($listener, inputObj);

        case 'keyup'		: return keyup$1($listener, inputObj);

        case 'click'		:
        case 'mousedown'    :
            return mouseEvents$1('mousedown', $listener,inputObj, canvas);

        case 'mouseup'	    : return mouseEvents$1('mouseup', $listener,inputObj);

        case 'mouseenter'	: return mouseEvents$1('mouseenter', $listener,inputObj);

        case 'mouseleave'	: return mouseEvents$1('mouseleave', $listener,inputObj);

        case 'timeout'		: return timeout$1($listener,inputObj);

        /*
         * Shortcuts
         */

        case 'enter'	: return keypressed$1($listener, _.assign({key:13},inputObj));

        case 'space'	: return keypressed$1($listener, _.assign({key:32},inputObj));

        case 'esc'	    : return keypressed$1($listener, _.assign({key:27},inputObj));

        case 'leftTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                left: 0,
                width: '30%',
                height: '100%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents$1('mousedown', $listener,inputObj);

        case 'rightTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                right: 0,
                width: '30%',
                height: '100%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents$1('mousedown', $listener,inputObj);

        case 'topTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                top: 0,
                width: '100%',
                height: '30%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents$1('mousedown', $listener,inputObj);

        case 'bottomTouch'	:
            inputObj.element = createElement(inputObj.css, {
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '30%',
                background: '#00FF00',
                opacity: 0.3
            });

            return mouseEvents$1('mousedown', $listener,inputObj);

        default:
            throw new Error('You have an input element without a recognized "on" property: ' + on);

    }


    function createElement(css2, css1){
        var el = document.createElement('div');
        css_1(el, css1);
        css_1(el, css2);
        return el;
    }
}

function createListener$1(inputObj,canvas){
    // @TODO: this API is very confusing
    // the binder MUST return the original stream ($listener)
    // maybe we should simplify this, possibly instead of explicitly exposing streams, expose callbacks?
    var $listener = stream();
    $listener.handle = inputObj.handle;

    if (_.isFunction(inputObj)) {
        $listener = inputObj($listener, inputObj, canvas);
        if (isStream($listener)) return $listener;
        throw new Error('Input functions must return valid streams');
    }

    if (!_.isPlainObject(inputObj)) throw new Error('Input must only contain objects and functions, do you have an undefined value?');

    if (_.isString(inputObj.on)) return inputBinder($listener,inputObj,canvas); // must return $listener :(

    if (_.isFunction(inputObj.on )) inputObj.on($listener, inputObj, canvas);
    if (_.isFunction(inputObj.off)) $listener.end.map(inputObj.off);
    return $listener;
}


function isStream(stream$$1) {return stream$$1._state; }

var now = window.performance.now
    ? window.performance.now.bind(window.performance)

    // We aren't using the absoulte time anywhere so we can use raw Date.now as a replacement
    // if we're not on IE9
    : Date.now.bind(Date);

function interfaceFn($events, trial){
    var listenerStack = []; // holds all active listeners
    var baseTime = 0;

    return { add:add,remove:remove,destroy:destroy,resetTimer:resetTimer };

    function add(inputObj){
        if (!inputObj) throw new Error('Missing input element. Could not add input listener');
        var stream = createListener$1(inputObj, trial.canvas);
        stream.map(addDetails).map($events); // pipe events to $events
        listenerStack.push(stream);

        function addDetails(event){
            return {
                handle      : inputObj.handle,
                event       : event,
                trialId     : trial._id,
                counter     : trial.counter,
                timestamp	: +new Date(),
                latency		: now() - baseTime
            };
        }
    }

    function remove(handle){
        // go through the listener stack and remove any listeners that fit the handle
        // note that we do this in reverse so that the index does not change
        for (var i = listenerStack.length - 1; i >= 0 ; i--){
            var listener = listenerStack[i];
            if (listener.handle === handle){
                listener.end(true);
                listenerStack.splice(i,1);
            }
        }
    }

    function destroy(){
        listenerStack.forEach(function(stream){
            stream.end(true);
        });
        listenerStack.length = 0;
    }

    function resetTimer(){ baseTime = now(); }
}

function getMedia$1(media){
    // all templateing is done within the inflate trial function and the sequencer
    var template = media.html || media.inlineTemplate || media.template; // give inline template precedence over template, because tempaltes are loaded into inlinetemplate
    var el;

    if (media.word) {
        el = document.createElement('div');
        el.textContent = media.word;
        return Promise.resolve(el);
    }

    if (media.image) {
        // at this time, we count on the preloader to throw for errors
        // the reject option isn't really being used here...
        return new Promise(function(resolve, reject){
            el = document.createElement('img');
            el.onload = function(){resolve(el);};
            el.onerror = function(){reject(new Error('Image not found: ' + el.src ));};
            el.src = media.image;
        });
    }

    if (media.jquery) Promise.reject(new Error('Jquery is no longer supported in minno-time'));

    if (template) { // html | template | inlineTemplate
        el = document.createElement('div');
        el.innerHTML = template;
        return Promise.resolve(el);
    } 

    return Promise.reject(new Error('Unrecognized media type')); // this is not a supported html type
}

function setSize$1(el, stimulus){
    var style = el.style;
    var size = stimulus.size || {};

    if (size.font_size) style.fontSize = size.font_size;

    // if this is a word, we don't want to set height (it breaks centering)
    if (isSet('height', size) && !stimulus.media.word) style.height = size.height + '%';

    if (isSet('width', size)) style.width = size.width + '%';

    return el;
}

function isSet(prop, obj){return prop in obj;}

var YCLASS = 'minno-stimulus-center-y';
var XCLASS = 'minno-stimulus-center-x';

function setPlace$1(el,stimulus){
    var location = stimulus.location || {};

    // set offsets:
    if (location.top == 'center' || location.bottom == 'center' || (location.top === undefined && location.bottom === undefined)) el.classList.add(YCLASS);
    if (location.left == 'center' || location.right == 'center' || (location.left === undefined && location.right === undefined)) el.classList.add(XCLASS);

    ['top','bottom','left','right'].forEach(setNumericLocation);

    function isNumeric(val) {return !isNaN(+val);}
    function setNumericLocation(attr){ if (isNumeric(location[attr])) el.style[attr] = location[attr] + '%'; }
}

function fixIE(el, resolve){
    var style = el.style;

    // count on setplace to findout when we need to center
    var xCenter = el.classList.contains(XCLASS);
    var yCenter = el.classList.contains(YCLASS);

    if (!xCenter && !yCenter) return resolve(el);

    fastdom.measure(function(){
        var computedStyle = window.getComputedStyle(el);
        var width = parseFloat(computedStyle.width);
        var height = parseFloat(computedStyle.height);

        fastdom.mutate(function(){
            // location (left/top) is set to 50% within the center class
            // we're adding the margin on IE where the transform does not work well
            // we need to cancel the transform set within the class though...
            style.transform = 'none';
            if (xCenter) style.marginLeft = '-' + (width/2) + 'px';
            if (yCenter) style.marginTop = '-' + (height/2) + 'px';
        });

    });
}

function Stimulus$1(stimulus, trial, canvas){
    var self = {
        el: null, // is set within init, some methods will break if not called before init...
        source: stimulus,
        trial: trial,
        canvas: canvas,
        init: init,
        show: show,
        hide: hide,
        name: name,
        mediaName: mediaName,
        destroy: destroy$1
    };

    // make sure we have a data object
    self.data = stimulus.data || {};

    // set the handle
    self.handle = self.data.handle = self.data.handle || stimulus.handle || stimulus.set;

    return self;
}


function init(){
    if (!this.source.media) throw new Error('Media object not defined for ' + this.name());

    return getMedia$1(this.source.media)
        .then(setupElement.bind(this, this.canvas));
}

function setupElement(canvas, el){
    var self = this;
    this.el = el;
    return new Promise(function(resolve){
        fastdom.mutate(function initStim(){
            // setup element
            el.classList.add('minno-stimulus');
            el.setAttribute('data-handle', self.handle); // data-handle for handeling of mouse/touch interactions
            setSize$1(el, self.source);
            setPlace$1(el, self.source);
            css_1(el, self.source.css || {});

            if (self.source.isLayout) el.classList.add('minno-stimulus-visible');

            // append to canvas
            canvas.appendChild(el);

            if (document.documentMode) fixIE(el, resolve);
            else resolve(el);
        });
    });
}

function show(){
    var el = this.el;
    if (!el) throw new Error('A stimulus can not be shown before init is called');

    fastdom.mutate(function showStim(){
        el.classList.add('minno-stimulus-visible');
    });
}

function hide(){
    var el = this.el;
    if (!el) throw new Error('A stimulus can not be hidden before init is called');

    fastdom.mutate(function hideStim(){
        el.classList.remove('minno-stimulus-visible');
    });
}

function destroy$1(){
    var el = this.el;
    var canvas = this.canvas;
    fastdom.mutate(function removeStim(){
        canvas.removeChild(el);
    });
}

function name(){
    var source = this.source;
    // if we have an alias ues it
    if (source.alias) {return source.alias;}
    if (this.data.alias) {return this.data.alias;} // if we have an alias ues it

    if (source.inherit && source.inherit.set) {return source.inherit.set;} // otherwise try using the set we inherited from
    if (this.handle) {return this.handle;} // otherwise use handle

    // if no individual name is given, we set a default at the collection level
}

function mediaName(options){
    var media = this.source.media;
    var fullpath = options && options.fullpath; // as set within settings

    if (media.alias) {return media.alias;} // if we have an alias ues it

    for (var prop in media) {
        if (contains(['image','template'],prop)) return fullpath ? media[prop] : media[prop].replace(/^.*[\\/]/, '');

        // sometimes we have an empty value (this happens when we load a template and then translate it into an inline template)
        if (contains(['word','html','inlineTemplate'],prop) && media[prop]) return media[prop];
    }

    // if no individual name is given, we set a default at the collection level
}

function contains(arr, val){ return arr.indexOf(val) != -1;}

function stimCollection(trial, canvas){
    var source = trial._source;
    var stimuli = source.stimuli.map(toStim);
    var layout = source.layout.map(toLayout).map(toStim);
    var ready = Promise.all(stimuli.concat(layout).map(function(stim){return stim.init();}));
    var self = {
        canvas: canvas,
        stimuli: stimuli,
        layout: layout,
        ready: ready,
        getStimlist: getStimlist,
        getMedialist: getMedialist,
        destroy: destroy
    };

    return self;

    function toStim(stim){ return Stimulus$1(stim, trial, canvas); }
    function toLayout(stim){ stim.isLayout = true; return stim;}
}

function getStimlist(){
    return this.stimuli
        .filter(function(stim){return !stim.source.nolog;})
        .map(function(stim, index){return stim.name() || ('stim' + index);});
}

function getMedialist(options){
    return this.stimuli
        .filter(function(stim){return !stim.source.nolog;})
        .map(function(stim, index){return stim.mediaName(options) || ('media' + index);});
}

function destroy(){
    this.stimuli.concat(this.layout).forEach(function(stim){stim.destroy();});
}

var global$3 = global$2();
var conditionHash = {
    begin:begin,
    inputEquals:inputEquals,
    inputEqualsTrial:inputEqualsTrial,
    inputEqualsStim:inputEqualsStim,
    trialEquals:trialEquals,
    inputEqualsGlobal:inputEqualsGlobal,
    globalEquals:globalEquals,
    globalEqualsTrial:globalEqualsTrial,
    globalEqualsStim:globalEqualsStim,
    currentEquals:currentEquals,
    currentEqualsTrial:currentEqualsTrial,
    currentEqualsStim:currentEqualsStim,
    inputEqualsCurrent:inputEqualsCurrent,
    fn:fn,
    custom:custom,

};

function getConditonFn(condition){
    if (_.isFunction(condition)) return condition;
    if (_.isFunction(conditionHash[condition.type])) return conditionHash[condition.type];
    throw new Error('Unknown condition type: ' + JSON.stringify(condition));
}

function begin(inputData){ return inputData.type === 'begin'; }

function inputEquals(inputData, condition){
    var values = Array.isArray(condition.value) ? condition.value : [condition.value];
    return values.indexOf(inputData.handle) !== -1;
}

function inputEqualsTrial(inputData, condition, trial){ return inputData.handle === trial.data[condition.property]; }

function inputEqualsStim(inputData, condition, trial){
    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.property] = inputData.handle;

    // are there stimuli answering this descriptions?
    return hasData(searchObj,trial);
}

function trialEquals(inputData, condition, trial){
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('trialEquals requires both "property" and "value" to be defined');
    return condition.value === trial.data[condition.property];
}

function inputEqualsGlobal(inputData, condition){
    if (typeof condition.property == 'undefined') throw new Error('inputEqualsGlobal requires "property" to be defined');
    return inputData.handle === global$3[condition.property];
}

function globalEquals(inputData, condition){
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('globalEquals requires both "property" and "value" to be defined');
    return condition.value === global$3[condition.property];
}

function globalEqualsTrial(inputData, condition, trial){
    if (typeof condition.globalProp == 'undefined' || typeof condition.trialProp == 'undefined') throw new Error('globalEqualsTrial requires both "globalProp" and "trialProp" to be defined');
    return global$3[condition.globalProp] !== trial.data[condition.trialProp];
}

function globalEqualsStim(inputData, condition, trial){
    if (typeof condition.globalProp == 'undefined' || typeof condition.stimProp == 'undefined') throw new Error('globalEqualsStim requires both "globalProp" and "stimProp" to be defined');

    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.stimProp] = global$3[condition.globalProp];

    // are there stimuli answering this descriptions?
    return hasData(searchObj,trial);
}

function inputEqualsCurrent(inputData, condition){
    var current = global$3.current;
    if (typeof condition.property == 'undefined') throw new Error('inputEqualsCurrent requires "property" to be defined');
    return inputData.handle === current[condition.property];
}
function currentEquals(inputData, condition){
    var current = global$3.current;
    if (typeof condition.property == 'undefined' || typeof condition.value == 'undefined') throw new Error('currentEquals requires both "property" and "value" to be defined');
    return condition.value !== current[condition.property];
}

function currentEqualsTrial(inputData, condition, trial){
    var current = global$3.current;
    if (typeof condition.currentProp == 'undefined' || typeof condition.trialProp == 'undefined') throw new Error('currentEqualsTrial requires both "currentProp" and "trialProp" to be defined');
    return current[condition.currentProp] === trial.data[condition.trialProp];
}

function currentEqualsStim(inputData, condition, trial){
    var current = global$3.current;
    if (typeof condition.currentProp == 'undefined' || typeof condition.stimProp == 'undefined') throw new Error('currentEqualsStim requires both "currentProp" and "stimProp" to be defined');

    // create search object
    var searchObj = {};
    if (condition.handle) searchObj['handle'] = condition.handle;
    searchObj[condition.stimProp] = current[condition.currentProp];

    // are there stimuli answering this descriptions?
    return hasData(searchObj, trial);
}

function fn(inputData, condition, trial){
    return condition.value.apply(trial,[condition,inputData, trial]);
}

function custom(inputData, condition, trial){
    return condition.fn.apply(null, [condition, inputData, trial]);
}

function hasData(searchObj, trial){
    return trial.stimulusCollection.stimuli.some(function(stim){
        var data = stim.data;
        for (var key in searchObj) {
            if (searchObj[key] !== data[key]) return false;
        }
        return true;
    });
}

/*
 * gets a condition array (or a single condition) and evaluates it
 * returns true if all statements are true, false otherwise
 *
 * a single condition looks like this:
 *
 *	condition = {
 *		type : 'begin/inputEquals/inputEqualsTrial/inputEqualsStim/function',
 *		value: 'right/trialAttribute/stimAttribute/customFunction',
 *		handle: 'stim handle' (optional in case we're targeting a stimulus)
 *	}
 *
 */

function conditionsEvaluate(conditions, inputData, trial){
    if (!conditions) throw new Error('There is an interaction without conditions!!');

    // make sure conditions is an array
    conditions = Array.isArray(conditions) ? conditions : [conditions];

    // if this is a begin event, make sure we only run conditions that have begin in them
    if (inputData.type == 'begin' && conditions.every(function(condition){return condition.type != 'begin';})) return false;

    return conditions.every(checkCondition);


    function checkCondition(condition){
        return getConditonFn(condition)(condition, inputData, trial);
    }
}

var actions = {
    /*
     * Stimulus actions
     */
    showStim: function(action, eventData, trial){
        var handle = action.handle || action;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) stim.show();
        });
    },

    hideStim: function(action, eventData, trial){
        var handle = action.handle || action;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) stim.hide();
        });
    },

    setStimAttr: function(action, eventData, trial){
        var handle = action.handle;
        var setter = action.setter;
        trial.stimulusCollection.stimuli.forEach(function(stim){
            if (handle == 'All' || stim.handle == handle) {
                if (_.isFunction(setter)) setter.apply(stim);
                else _.extend(stim.data, setter);
            }
        });
    },

    /*
     * Trial actions
     */

    setTrialAttr: function(action, eventData, trial){
        var setter = action.setter;
        if (typeof setter == 'undefined') throw new Error('The setTrialAttr action requires a setter property');
        if (_.isFunction(setter)) setter.apply(trial, [trial.data,eventData]);
        else _.extend(trial.data,setter);
    },

    setInput: function(action, eventData, trial){
        if (typeof action.input == 'undefined') throw new Error('The setInput action requires an input property');
        trial.input.add(action.input);
    },

    trigger: function(action, eventData, trial){
        if (typeof action.handle == 'undefined') throw new Error('The trigger action requires a handle property');
        trial.input.add({handle:action.handle, on:'timeout', duration:+action.duration || 0});
    },

    removeInput: function(action, eventData, trial){
        var input = trial.input;
        var handleList = action.handle;
        if (typeof handleList == 'undefined') throw new Error('The removeInput action requires a handle property');
        if (handleList == 'All' || _.include(handleList,'All')) input.destroy();
        else input.remove(handleList);
    },

    goto: function(action, eventData, trial){
        trial._next = [action.destination,action.properties];
    },

    endTrial: function(action, eventData, trial){
        trial.end();
    },

    resetTimer: function(action,eventData,trial){
        // when to reset timer
        action.immidiate ? reset() :  fastdom.mutate(reset);

        function reset(){
            eventData.latency = 0;
            trial.input.resetTimer();
        }
    },

    /*
     * Logger
     */

    log: function(action,eventData,trial){
        trial.$logs(arguments);
    },

    /*
     * Misc
     */

    setGlobalAttr: function(action){
        switch (typeof action.setter){
            case 'function':
                action.setter.apply(null,[global$2(), action]);
                break;
            case 'object':
                _.extend(global$2(), action.setter);
                break;
            default:
                throw new Error('setGlobalAttr requires a "setter" property');
        }
    },

    custom: function(action,eventData, trial){
        if (typeof action.fn != 'function') throw new Error('The custom action requires a fn propery');
        action.fn(action, eventData, trial);
    },

    canvas: function(action, eventData, trial){
        var canvas = trial.cavnas;
        var map = {
            background 			: {element: document.body, property: 'backgroundColor'},
            canvasBackground	: {element: canvas, property:'backgroundColor'},
            borderColor			: {element: canvas, property:'borderColor'},
            borderWidth			: {element: canvas, property:'borderWidth'}
        };

        // settings activator
        var off = canvasContructor(map, _.pick(action,['background','canvasBackground','borderColor','borderWidth']));
        trial.$end.map(off);
    }

};

/*
 * accepts an array of actions (or a single action)
 * and applies them
 *
 * actions = [
 *		{type:actionName,more:options},
 *		{actionName:options}
 * ]
 * @param actions: single action object or array of action objects
 * @param eventData: eventData object
 * @returns Boolean continueActions: whether this action stops further action activations
 */

function applyActions(actions$$1, eventData, trial){
    // marks whether this is the final action to take
    var continueActions = true;

    if (!actions$$1) throw new Error('There is an interaction without actions!!');

    actions$$1 = _.isArray(actions$$1) ? actions$$1 : [actions$$1];

    _.forEach(actions$$1,function(action){
        var actionFn = actions[action.type];
        if (!actionFn) throw new Error('unknown action: ' + action.type);

        // the only reason to halt action activation is the endTrial command
        if (action.type === 'endTrial') continueActions = false;
        actionFn(action, eventData, trial);
    });

    return continueActions;
}

/*
* Organizer for the interaction function
*/

/*
 * Trial -> Event -> Event
 * 
 * Can use trial to produce side efects
 **/
function interactions$1(trial){
    var interactions = trial._source.interactions;
    var isDebug = trial._source.DEBUG && window.DEBUG;

    // @TODO: validate interactions (isArray[Object], Object has conditions, Object has actions
    
    return eventMap;
    function eventMap(event){
        var i, interaction, conditionTrue;


        // eslint-disable-next-line no-console
        if (isDebug) console.groupCollapsed('Event: ' + (event.handle || event.type), event);

        // use an explicit for loop because we need to be able to break
        for (i=0; i<interactions.length; i++){
            interaction = interactions[i];
            conditionTrue = conditionsEvaluate(interaction.conditions, event, trial);

            // eslint-disable-next-line no-console
            if (isDebug) console.log(conditionTrue, interaction.conditions);

            // if this action includes endTrial we want to stop evalutation
            // otherwise we might evaluate using data from the next trial by accident...
            if (conditionTrue) if ( !applyActions(interaction.actions, event, trial) ) break;
        }

        // eslint-disable-next-line no-console
        if (isDebug) console.groupEnd('Event: ' + (event.handle || event.type));

        return event;
    }
}

var gid = 0;

// data is already fully inflated
function Trial$1(source, canvas, settings){
    // make sure we have all our stuff :)
    if (!source.interactions) throw new Error('Interactions not defined');

    this.canvas = canvas;
    this.settings = settings;
    this._source = source;

    this.$logs = stream();
    this.$events = stream();
    this.$end = this.$events.end;

    // make sure we always have a data container
    this.data = source.data || {};

    // create a uniqueId for this trial
    this._id = _.uniqueId('trial_');
    this.counter = gid++;

    this.input = interfaceFn(this.$events, this);
    this.stimulusCollection = stimCollection(this, canvas);

    // listen for interactions
    this.$events.map(interactions$1(this));

    // the next trial we want to play
    // by default this is simply the next trial, this can be changed using the goto action
    // the syntax is [destination, properties]
    this._next = ['next',{}];
}

_.extend(Trial$1.prototype,{
    start: function(){
        var trial = this;

        // eslint-disable-next-line no-console
        if (this._source.DEBUG && window.DEBUG) console.group('Trial: ' + this.counter); 

        // wait until all simuli are loaded
        return trial.stimulusCollection.ready
            .then(function(){

                // activate input
                arrayWrap(trial._source.input).forEach(trial.input.add); // add each input
                trial.input.resetTimer(); // reset the interface timer so that event latencies are relative to now.

                // start running
                trial.$events({type:'begin',latency:0});
            });
    },

    end: function(){

        // eslint-disable-next-line no-console
        if (this._source.DEBUG && window.DEBUG) console.groupEnd('Trial: ' + this.counter); 

        // cancel all listeners
        this.input.destroy();

        this.$events.end(true);
        this.$end(true);
    },

    name: function(){
        // if we have an alias ues it
        if (this.alias) { return this.alias; }
        if (this.data.alias) { return this.data.alias; }

        // otherwise try using the set we inherited from
        if (_.isString(this._source.inherit)){ return this._source.inherit; }
        if (_.isPlainObject(this._source.inherit)){
            return this._source.inherit.set;
        }

        // we're out of options here
    }
});

function arrayWrap(arr){
    if (!arr){return [];}
    return _.isArray(arr) ? arr : [arr];
}

function nextTrial$1(db, settings, goto){
    var destination = goto[0], properties = goto[1];
    var sequence = db.currentSequence;
    var global = global$2();
    var context = {global: global, current: global.current};
    var source;

    sequence.go(destination, properties, context);
    source = sequence.current(context, {skip:['layout','stimuli']});

    if (!source) return {done:true};

    source.stimuli = _.map(source.stimuli || [], buildStim, context);
    source.layout = _.map(source.layout || [], buildStim, context);

    context.trialData = null;

    return {value:source};

    function buildMedia(stim, prop, context){
        var val = stim[prop];

        if (_.isUndefined(val)) return false;
        if (_.isString(val)) val = {word: val};

        val = db.inflate('media', val, context);

        // note that the base url is added to the media object during the sequence preload
        // if needed, build url
        if (val.image) val.image = buildUrl(settings.base_url, val.image, 'image');

        if (val.template){
            // @TODO: remove dependency on requirejs
            val.inlineTemplate = requirejs('text!' + buildUrl(settings.base_url, val.template, 'template'));
            val.inlineTemplate = _.template(val.inlineTemplate)(context);
        }

        stim[prop] = val;

        context.mediaData = null;
        context.mediaMeta = null;
    }

    function buildStim(stim){
        var context = this;

        stim = db.inflate('stimulus', stim, context, {skip:['media','touchMedia']});
        buildMedia(stim, 'media', context);
        buildMedia(stim, 'touchMedia', context);
        context.stimulusData = null;
        context.stimulusMeta = null;
        return stim;
    }
}

function post$1(url, data){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('POST',url, true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        request.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 400) resolve(this.responseText);
                else reject(new Error('Failed posting to: ' + url));
            }
        };

        request.send(serialize(data));
    });
}

function serialize(data) {
    if (typeof data == 'string') return data;
    return JSON.stringify(data);
}

function poster$1($logs, settings){
    var cache = [];
    var url = settings.url;

    if (!url) return; // if we have no url, we can't log anything anyway

    $logs.map(eachLog);
    $logs.end.map(finalizefLogs);

    function eachLog(log){
        cache.push(log);
        if (!settings.pulse) return;
        if (cache.length >= settings.pulse) {
            send(cache);
            cache.length = 0;
        }
    }

    function finalizefLogs(){
        if (cache.length) send(cache);
    }

    function send(logs){
        // build post data
        var data = {json: JSON.stringify(logs)};
        var postData = _.assign(data, settings.metaData);
        var serializedPost = serialize(postData);

        return post$1(url,serializedPost)
            .catch(function retry(){ return post$1(url, serializedPost); })
            .catch(settings.error || _.noop);
    }

    function serialize(data){
        var key, r = [];
        for (key in data) r.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        return r.join('&').replace(/%20/g, '+');
    }
}

function transformLogs$1(action,eventData,trial){
    var global = window.piGlobal;
    var trialData = trial.data, inputData = eventData, logStack = global.current.logs;
    var fullpath = _.get(trial, 'settings.logger.fullpath', false);

    var stimList = trial.stimulusCollection.getStimlist();
    var mediaList = trial.stimulusCollection.getMedialist({fullpath:fullpath});

    return {
        log_serial : logStack.length,
        trial_id: trial.counter,
        name: trial.name(),
        responseHandle: inputData.handle,
        latency: Math.floor(inputData.latency),
        stimuli: stimList,
        media: mediaList,
        data: trialData
    };
}

function createLogs$1($logs, settings){
    var $sink = $logs.map(applyMap(settings.logger || settings.transformLogs || transformLogs$1));
    $sink.map(function(log){
        global$2().current.logs.push(log);
    });

    poster$1($sink, settings);
    if (settings.poster) settings.poster($sink, settings);

    return $sink;

    // $logs is a stream of array, we want to apply them as args to the transform function
    function applyMap(fn){
        return function(args){ return fn.apply(null,args); };
    }
}

function playerPhase(sink){
    var canvas = sink.canvas;
    var db = sink.db;
    var settings = sink.settings;

    var $source = stream();
    var $trial = $source.map(activateTrial());
    var $logs = stream();

    var onDone = _.get(settings, 'hooks.endTask', settings.onEnd || _.noop);

    $source.end
        .map(clearCanvas)
        .map(onDone);

    return _.extend({
        $trial:$trial, 
        end: $source.end.bind(null,true), 
        $logs: createLogs$1($logs, settings.logger || {}), 
        start: play.bind(null, ['next', {}])
    }, sink);

    function clearCanvas(){
        var trial = $trial();
        if (trial) trial.stimulusCollection.destroy();
    }

    function play(goto){
        var next = nextTrial$1(db, settings, goto);
        if (next.done) $source.end(true);
        else $source(next.value);
    }

    function activateTrial(cache){
        return activate;
        function activate(source){
            var oldTrial = cache;
            var trial = cache = new Trial$1(source, canvas, settings);
            trial.$logs.map($logs); 
            trial.$end
                .map(function(){
                    play(trial._next); // when we're done try to play the next one
                });

            trial.start();

            if (oldTrial) {
                // we leave the old stimuli until the current ones are visiblie to maintain the continuity between trials
                // This mutate waits until the first mutation in order to schedudual the removal of the old stimuli
                fastdom.mutate(function oldtrial(){
                    oldTrial.stimulusCollection.destroy();
                });
            }

            return trial;
        }
    }
}

function activate$1(canvas, script){
    var sink = setup$1(canvas, script);
    var playSink = playerPhase(sink);

    playSink.$trial.end.map(playSink.$resize.end.bind(null, true)); // end resize stream

    // preload Images, then start "playPhase"
    preloadPhase$1(canvas, script).then(playSink.start);

    return playSink;
}

return activate$1;

})));
//# sourceMappingURL=time.js.map
