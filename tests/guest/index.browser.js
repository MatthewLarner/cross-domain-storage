(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = 'function' == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw ((a.code = 'MODULE_NOT_FOUND'), a);
                }
                var p = (n[i] = { exports: {} });
                e[i][0].call(
                    p.exports,
                    function (r) {
                        var n = e[i][1][r];
                        return o(n || r);
                    },
                    p,
                    p.exports,
                    r,
                    e,
                    n,
                    t,
                );
            }
            return n[i].exports;
        }
        for (var u = 'function' == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    }
    return r;
})()(
    {
        1: [
            function (require, module, exports) {
                /* Copyright (C) 2012 Kory Nunn
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

NOTE:
This code is formatted for run-speed and to assist compilers.
This might make it harder to read at times, but the code's intention should be transparent. */

                // IIFE our function
                ((exporter) => {
                    // Define our function and its properties
                    // These strings are used multiple times, so this makes things smaller once compiled
                    const func = 'function',
                        isNodeString = 'isNode',
                        // Helper functions used throughout the script
                        isType = (object, type) => typeof object === type,
                        // Recursively appends children to given element. As a text node if not already an element
                        appendChild = (element, child) => {
                            if (child !== null) {
                                if (Array.isArray(child)) {
                                    // Support (deeply) nested child elements
                                    child.map((subChild) => appendChild(element, subChild));
                                } else {
                                    if (!crel[isNodeString](child)) {
                                        child = document.createTextNode(child);
                                    }
                                    element.appendChild(child);
                                }
                            }
                        };
                    //
                    function crel(element, settings) {
                        // Define all used variables / shortcuts here, to make things smaller once compiled
                        let args = arguments, // Note: assigned to a variable to assist compilers.
                            index = 1,
                            key,
                            attribute;
                        // If first argument is an element, use it as is, otherwise treat it as a tagname
                        element = crel.isElement(element) ? element : document.createElement(element);
                        // Check if second argument is a settings object
                        if (isType(settings, 'object') && !crel[isNodeString](settings) && !Array.isArray(settings)) {
                            // Don't treat settings as a child
                            index++;
                            // Go through settings / attributes object, if it exists
                            for (key in settings) {
                                // Store the attribute into a variable, before we potentially modify the key
                                attribute = settings[key];
                                // Get mapped key / function, if one exists
                                key = crel.attrMap[key] || key;
                                // Note: We want to prioritise mapping over properties
                                if (isType(key, func)) {
                                    key(element, attribute);
                                } else if (isType(attribute, func)) {
                                    // ex. onClick property
                                    element[key] = attribute;
                                } else {
                                    // Set the element attribute
                                    element.setAttribute(key, attribute);
                                }
                            }
                        }
                        // Loop through all arguments, if any, and append them to our element if they're not `null`
                        for (; index < args.length; index++) {
                            appendChild(element, args[index]);
                        }

                        return element;
                    }

                    // Used for mapping attribute keys to supported versions in bad browsers, or to custom functionality
                    crel.attrMap = {};
                    crel.isElement = (object) => object instanceof Element;
                    crel[isNodeString] = (node) => node instanceof Node;
                    // Expose proxy interface
                    if (typeof Proxy != 'undefined') {
                        crel.proxy = new Proxy(crel, {
                            get: (target, key) => {
                                !(key in crel) && (crel[key] = crel.bind(null, key));
                                return crel[key];
                            },
                        });
                    }
                    // Export crel
                    exporter(crel, func);
                })((product, func) => {
                    if (typeof exports === 'object') {
                        // Export for Browserify / CommonJS format
                        module.exports = product;
                    } else if (typeof define === func && define.amd) {
                        // Export for RequireJS / AMD format
                        define(() => product);
                    } else {
                        // Export as a 'global' function
                        this.crel = product;
                    }
                });
            },
            {},
        ],
        2: [
            function (require, module, exports) {
                var doc = {
                    document: typeof document !== 'undefined' ? document : null,
                    setDocument: function (d) {
                        this.document = d;
                    },
                };

                var arrayProto = [],
                    isList = require('./isList'),
                    getTargets = require('./getTargets')(doc.document),
                    getTarget = require('./getTarget')(doc.document),
                    space = ' ';

                ///[README.md]

                function isIn(array, item) {
                    for (var i = 0; i < array.length; i++) {
                        if (item === array[i]) {
                            return true;
                        }
                    }
                }

                /**

    ## .find

    finds elements that match the query within the scope of target

        //fluent
        doc(target).find(query);

        //legacy
        doc.find(target, query);
*/

                function find(target, query) {
                    target = getTargets(target);
                    if (query == null) {
                        return target;
                    }

                    if (isList(target)) {
                        var results = [];
                        for (var i = 0; i < target.length; i++) {
                            var subResults = doc.find(target[i], query);
                            for (var j = 0; j < subResults.length; j++) {
                                if (!isIn(results, subResults[j])) {
                                    results.push(subResults[j]);
                                }
                            }
                        }
                        return results;
                    }

                    return target ? target.querySelectorAll(query) : [];
                }

                /**

    ## .findOne

    finds the first element that matches the query within the scope of target

        //fluent
        doc(target).findOne(query);

        //legacy
        doc.findOne(target, query);
*/

                function findOne(target, query) {
                    target = getTarget(target);
                    if (query == null) {
                        return target;
                    }

                    if (isList(target)) {
                        var result;
                        for (var i = 0; i < target.length; i++) {
                            result = findOne(target[i], query);
                            if (result) {
                                break;
                            }
                        }
                        return result;
                    }

                    return target ? target.querySelector(query) : null;
                }

                /**

    ## .closest

    recurses up the DOM from the target node, checking if the current element matches the query

        //fluent
        doc(target).closest(query);

        //legacy
        doc.closest(target, query);
*/

                function closest(target, query) {
                    target = getTarget(target);

                    if (isList(target)) {
                        target = target[0];
                    }

                    while (target && target.ownerDocument && !is(target, query)) {
                        target = target.parentNode;
                    }

                    return target === doc.document && target !== query ? null : target;
                }

                /**

    ## .is

    returns true if the target element matches the query

        //fluent
        doc(target).is(query);

        //legacy
        doc.is(target, query);
*/

                function is(target, query) {
                    target = getTarget(target);

                    if (isList(target)) {
                        target = target[0];
                    }

                    if (!target.ownerDocument || typeof query !== 'string') {
                        return target === query;
                    }

                    if (target === query) {
                        return true;
                    }

                    var parentless = !target.parentNode;

                    if (parentless) {
                        // Give the element a parent so that .querySelectorAll can be used
                        document.createDocumentFragment().appendChild(target);
                    }

                    var result = arrayProto.indexOf.call(find(target.parentNode, query), target) >= 0;

                    if (parentless) {
                        target.parentNode.removeChild(target);
                    }

                    return result;
                }

                /**

    ## .addClass

    adds classes to the target (space separated string or array)

        //fluent
        doc(target).addClass(query);

        //legacy
        doc.addClass(target, query);
*/

                function addClass(target, classes) {
                    target = getTargets(target);

                    if (isList(target)) {
                        for (var i = 0; i < target.length; i++) {
                            addClass(target[i], classes);
                        }
                        return this;
                    }
                    if (!classes) {
                        return this;
                    }

                    var classes = Array.isArray(classes) ? classes : classes.split(space),
                        currentClasses = target.classList ? null : target.className.split(space);

                    for (var i = 0; i < classes.length; i++) {
                        var classToAdd = classes[i];
                        if (!classToAdd || classToAdd === space) {
                            continue;
                        }
                        if (target.classList) {
                            target.classList.add(classToAdd);
                        } else if (!currentClasses.indexOf(classToAdd) >= 0) {
                            currentClasses.push(classToAdd);
                        }
                    }
                    if (!target.classList) {
                        target.className = currentClasses.join(space);
                    }
                    return this;
                }

                /**

    ## .removeClass

    removes classes from the target (space separated string or array)

        //fluent
        doc(target).removeClass(query);

        //legacy
        doc.removeClass(target, query);
*/

                function removeClass(target, classes) {
                    target = getTargets(target);

                    if (isList(target)) {
                        for (var i = 0; i < target.length; i++) {
                            removeClass(target[i], classes);
                        }
                        return this;
                    }

                    if (!classes) {
                        return this;
                    }

                    var classes = Array.isArray(classes) ? classes : classes.split(space),
                        currentClasses = target.classList ? null : target.className.split(space);

                    for (var i = 0; i < classes.length; i++) {
                        var classToRemove = classes[i];
                        if (!classToRemove || classToRemove === space) {
                            continue;
                        }
                        if (target.classList) {
                            target.classList.remove(classToRemove);
                            continue;
                        }
                        var removeIndex = currentClasses.indexOf(classToRemove);
                        if (removeIndex >= 0) {
                            currentClasses.splice(removeIndex, 1);
                        }
                    }
                    if (!target.classList) {
                        target.className = currentClasses.join(space);
                    }
                    return this;
                }

                function addEvent(settings) {
                    var target = getTarget(settings.target);
                    if (target) {
                        target.addEventListener(settings.event, settings.callback, false);
                    } else {
                        console.warn('No elements matched the selector, so no events were bound.');
                    }
                }

                /**

    ## .on

    binds a callback to a target when a DOM event is raised.

        //fluent
        doc(target/proxy).on(events, target[optional], callback);

    note: if a target is passed to the .on function, doc's target will be used as the proxy.

        //legacy
        doc.on(events, target, query, proxy[optional]);
*/

                function on(events, target, callback, proxy) {
                    proxy = getTargets(proxy);

                    if (!proxy) {
                        target = getTargets(target);
                        // handles multiple targets
                        if (isList(target)) {
                            var multiRemoveCallbacks = [];
                            for (var i = 0; i < target.length; i++) {
                                multiRemoveCallbacks.push(on(events, target[i], callback, proxy));
                            }
                            return function () {
                                while (multiRemoveCallbacks.length) {
                                    multiRemoveCallbacks.pop();
                                }
                            };
                        }
                    }

                    // handles multiple proxies
                    // Already handles multiple proxies and targets,
                    // because the target loop calls this loop.
                    if (isList(proxy)) {
                        var multiRemoveCallbacks = [];
                        for (var i = 0; i < proxy.length; i++) {
                            multiRemoveCallbacks.push(on(events, target, callback, proxy[i]));
                        }
                        return function () {
                            while (multiRemoveCallbacks.length) {
                                multiRemoveCallbacks.pop();
                            }
                        };
                    }

                    var removeCallbacks = [];

                    if (typeof events === 'string') {
                        events = events.split(space);
                    }

                    for (var i = 0; i < events.length; i++) {
                        var eventSettings = {};
                        if (proxy) {
                            if (proxy === true) {
                                proxy = doc.document;
                            }
                            eventSettings.target = proxy;
                            eventSettings.callback = function (event) {
                                var closestTarget = closest(event.target, target);
                                if (closestTarget) {
                                    callback(event, closestTarget);
                                }
                            };
                        } else {
                            eventSettings.target = target;
                            eventSettings.callback = callback;
                        }

                        eventSettings.event = events[i];

                        addEvent(eventSettings);

                        removeCallbacks.push(eventSettings);
                    }

                    return function () {
                        while (removeCallbacks.length) {
                            var removeCallback = removeCallbacks.pop();
                            getTarget(removeCallback.target).removeEventListener(
                                removeCallback.event,
                                removeCallback.callback,
                            );
                        }
                    };
                }

                /**

    ## .off

    removes events assigned to a target.

        //fluent
        doc(target/proxy).off(events, target[optional], callback);

    note: if a target is passed to the .on function, doc's target will be used as the proxy.

        //legacy
        doc.off(events, target, callback, proxy);
*/

                function off(events, target, callback, proxy) {
                    if (isList(target)) {
                        for (var i = 0; i < target.length; i++) {
                            off(events, target[i], callback, proxy);
                        }
                        return this;
                    }
                    if (proxy instanceof Array) {
                        for (var i = 0; i < proxy.length; i++) {
                            off(events, target, callback, proxy[i]);
                        }
                        return this;
                    }

                    if (typeof events === 'string') {
                        events = events.split(space);
                    }

                    if (typeof callback !== 'function') {
                        proxy = callback;
                        callback = null;
                    }

                    proxy = proxy ? getTarget(proxy) : doc.document;

                    var targets = typeof target === 'string' ? find(target, proxy) : [target];

                    for (var targetIndex = 0; targetIndex < targets.length; targetIndex++) {
                        var currentTarget = targets[targetIndex];

                        for (var i = 0; i < events.length; i++) {
                            currentTarget.removeEventListener(events[i], callback);
                        }
                    }
                    return this;
                }

                /**

    ## .append

    adds elements to a target

        //fluent
        doc(target).append(children);

        //legacy
        doc.append(target, children);
*/

                function append(target, children) {
                    var target = getTarget(target),
                        children = getTarget(children);

                    if (isList(target)) {
                        target = target[0];
                    }

                    if (isList(children)) {
                        for (var i = 0; i < children.length; i++) {
                            append(target, children[i]);
                        }
                        return;
                    }

                    target.appendChild(children);
                }

                /**

    ## .prepend

    adds elements to the front of a target

        //fluent
        doc(target).prepend(children);

        //legacy
        doc.prepend(target, children);
*/

                function prepend(target, children) {
                    var target = getTarget(target),
                        children = getTarget(children);

                    if (isList(target)) {
                        target = target[0];
                    }

                    if (isList(children)) {
                        //reversed because otherwise the would get put in in the wrong order.
                        for (var i = children.length - 1; i; i--) {
                            prepend(target, children[i]);
                        }
                        return;
                    }

                    target.insertBefore(children, target.firstChild);
                }

                /**

    ## .isVisible

    checks if an element or any of its parents display properties are set to 'none'

        //fluent
        doc(target).isVisible();

        //legacy
        doc.isVisible(target);
*/

                function isVisible(target) {
                    var target = getTarget(target);
                    if (!target) {
                        return;
                    }
                    if (isList(target)) {
                        var i = -1;

                        while (target[i++] && isVisible(target[i])) {}
                        return target.length >= i;
                    }
                    while (target.parentNode && target.style.display !== 'none') {
                        target = target.parentNode;
                    }

                    return target === doc.document;
                }

                /**

    ## .indexOfElement

    returns the index of the element within it's parent element.

        //fluent
        doc(target).indexOfElement();

        //legacy
        doc.indexOfElement(target);

*/

                function indexOfElement(target) {
                    target = getTargets(target);
                    if (!target) {
                        return;
                    }

                    if (isList(target)) {
                        target = target[0];
                    }

                    var i = -1;

                    var parent = target.parentElement;

                    if (!parent) {
                        return i;
                    }

                    while (parent.children[++i] !== target) {}

                    return i;
                }

                /**

    ## .ready

    call a callback when the document is ready.

    returns -1 if there is no parentElement on the target.

        //fluent
        doc().ready(callback);

        //legacy
        doc.ready(callback);
*/

                function ready(callback) {
                    if (
                        doc.document &&
                        (doc.document.readyState === 'complete' || doc.document.readyState === 'interactive')
                    ) {
                        callback();
                    } else if (window.attachEvent) {
                        document.attachEvent('onreadystatechange', callback);
                        window.attachEvent('onLoad', callback);
                    } else if (document.addEventListener) {
                        document.addEventListener('DOMContentLoaded', callback, false);
                    }
                }

                doc.find = find;
                doc.findOne = findOne;
                doc.closest = closest;
                doc.is = is;
                doc.addClass = addClass;
                doc.removeClass = removeClass;
                doc.off = off;
                doc.on = on;
                doc.append = append;
                doc.prepend = prepend;
                doc.isVisible = isVisible;
                doc.ready = ready;
                doc.indexOfElement = indexOfElement;

                module.exports = doc;
            },
            { './getTarget': 4, './getTargets': 5, './isList': 6 },
        ],
        3: [
            function (require, module, exports) {
                var doc = require('./doc'),
                    isList = require('./isList'),
                    getTargets = require('./getTargets')(doc.document),
                    flocProto = [];

                function Floc(items) {
                    this.push.apply(this, items);
                }
                Floc.prototype = flocProto;
                flocProto.constructor = Floc;

                function floc(target) {
                    var instance = getTargets(target);

                    if (!isList(instance)) {
                        if (instance) {
                            instance = [instance];
                        } else {
                            instance = [];
                        }
                    }
                    return new Floc(instance);
                }

                var returnsSelf = 'addClass removeClass append prepend'.split(' ');

                for (var key in doc) {
                    if (typeof doc[key] === 'function') {
                        floc[key] = doc[key];
                        flocProto[key] = (function (key) {
                            var instance = this;
                            // This is also extremely dodgy and fast
                            return function (a, b, c, d, e, f) {
                                var result = doc[key](this, a, b, c, d, e, f);

                                if (result !== doc && isList(result)) {
                                    return floc(result);
                                }
                                if (returnsSelf.indexOf(key) >= 0) {
                                    return instance;
                                }
                                return result;
                            };
                        })(key);
                    }
                }
                flocProto.on = function (events, target, callback) {
                    var proxy = this;
                    if (typeof target === 'function') {
                        callback = target;
                        target = this;
                        proxy = null;
                    }
                    doc.on(events, target, callback, proxy);
                    return this;
                };

                flocProto.off = function (events, target, callback) {
                    var reference = this;
                    if (typeof target === 'function') {
                        callback = target;
                        target = this;
                        reference = null;
                    }
                    doc.off(events, target, callback, reference);
                    return this;
                };

                flocProto.ready = function (callback) {
                    doc.ready(callback);
                    return this;
                };

                flocProto.addClass = function (className) {
                    doc.addClass(this, className);
                    return this;
                };

                flocProto.removeClass = function (className) {
                    doc.removeClass(this, className);
                    return this;
                };

                module.exports = floc;
            },
            { './doc': 2, './getTargets': 5, './isList': 6 },
        ],
        4: [
            function (require, module, exports) {
                var singleId = /^#\w+$/;

                module.exports = function (document) {
                    return function getTarget(target) {
                        if (typeof target === 'string') {
                            if (singleId.exec(target)) {
                                return document.getElementById(target.slice(1));
                            }
                            return document.querySelector(target);
                        }

                        return target;
                    };
                };
            },
            {},
        ],
        5: [
            function (require, module, exports) {
                var singleClass = /^\.\w+$/,
                    singleId = /^#\w+$/,
                    singleTag = /^\w+$/;

                module.exports = function (document) {
                    return function getTargets(target) {
                        if (typeof target === 'string') {
                            if (singleId.exec(target)) {
                                // If you have more than 1 of the same id in your page,
                                // thats your own stupid fault.
                                return [document.getElementById(target.slice(1))];
                            }
                            if (singleTag.exec(target)) {
                                return document.getElementsByTagName(target);
                            }
                            if (singleClass.exec(target)) {
                                return document.getElementsByClassName(target.slice(1));
                            }
                            return document.querySelectorAll(target);
                        }

                        return target;
                    };
                };
            },
            {},
        ],
        6: [
            function (require, module, exports) {
                module.exports = function isList(object) {
                    return (
                        object != null &&
                        typeof object === 'object' &&
                        'length' in object &&
                        !('nodeType' in object) &&
                        object.self != object
                    ); // in IE8, window.self is window, but it is not === window, but it is == window......... WTF!?
                };
            },
            {},
        ],
        7: [
            function (require, module, exports) {
                const prefix = 'sessionAccessId-';

                function getId(data) {
                    let id;

                    if (data && data.id && ~data.id.indexOf(prefix)) {
                        id = data.id;
                    }

                    return id;
                }

                module.exports = getId;
            },
            {},
        ],
        8: [
            function (require, module, exports) {
                const getId = require('../getId');

                const prefix = 'sessionAccessId-';

                function createId() {
                    return prefix + Date.now();
                }

                module.exports = function storageGuest(source, parent) {
                    parent = parent || document.body;

                    let contentWindow;
                    let callbacks = {};
                    const sessionRequests = [];
                    let connected = false;
                    let closed = true;
                    let connectedTimeout;
                    let isLoaded = false;

                    const iframe = document.createElement('iframe');
                    iframe.src = source;
                    iframe.width = 0;
                    iframe.height = 0;
                    iframe.style.display = 'none';
                    iframe.onload = () => {
                        isLoaded = true;
                    };

                    function openStorage() {
                        parent.appendChild(iframe);
                        contentWindow = iframe.contentWindow;
                        closed = false;

                        window.addEventListener('message', handleMessage);

                        checkConnected();
                    }

                    openStorage();

                    function handleMessage(event) {
                        const response = event.data;
                        const sessionAccessId = getId(response);

                        if (sessionAccessId === 'sessionAccessId-connected') {
                            connected = true;
                            return;
                        }

                        if (response.connectError) {
                            Object.keys(callbacks).forEach((key) => callbacks[key](response.error));
                            callbacks = {};
                            return;
                        }

                        const callback = callbacks[sessionAccessId];

                        if (sessionAccessId && callback) {
                            callback(response.error, response.data);
                        }
                    }

                    function close() {
                        clearTimeout(connectedTimeout);
                        window.removeEventListener('message', handleMessage);
                        iframe.parentNode.removeChild(iframe);
                        connected = false;
                        closed = true;
                    }

                    function message(method, key, value, callback) {
                        if (closed) {
                            openStorage();
                        }

                        if (!connected && method !== 'connect') {
                            sessionRequests.push([method, key, value, callback]);
                        }

                        const id = createId();

                        if (callbacks && typeof callback === 'function') {
                            callbacks[id] = callback;
                        }

                        if (isLoaded) {
                            contentWindow.postMessage(
                                {
                                    method,
                                    key,
                                    value,
                                    id,
                                },
                                source,
                            );
                        }
                    }

                    function get(key, callback) {
                        if (!callback) {
                            throw new Error('callback required for get');
                        }

                        message('get', key, null, callback);
                    }

                    function set(key, value, callback) {
                        message('set', key, value, callback);
                    }

                    function remove(key, callback) {
                        message('remove', key, null, callback);
                    }

                    function checkConnected() {
                        if (connected) {
                            clearTimeout(connectedTimeout);
                            while (sessionRequests.length) {
                                message(...sessionRequests.pop());
                            }

                            return;
                        }

                        message('connect');

                        connectedTimeout = setTimeout(checkConnected, 125);
                    }

                    return {
                        get,
                        set,
                        remove,
                        close,
                    };
                };
            },
            { '../getId': 7 },
        ],
        9: [
            function (require, module, exports) {
                const crel = require('crel');
                const doc = require('doc-js');
                const createStorageGuest = require('../../source/guest');

                const instructions = crel(
                    'div',
                    crel('h3', 'cross-domain-storage guest'),
                    'If not all green then view the console.',
                );

                /* eslint-disable */

                // TODO: Make actualy tests not just this nested nightmare
                doc.ready(() => {
                    crel(document.body, instructions);
                    const storageGuest = createStorageGuest('http://localhost:9123');

                    storageGuest.get('foo', (error, data) => {
                        console.log('1. foo should be bar: ', { error, data });
                        crel(
                            instructions,
                            crel('div', { style: `color:${data === 'bar' ? 'green' : 'red'}` }, 'foo should be "bar"'),
                        );

                        storageGuest.set('foo', 'cabbage', (error, data) => {
                            console.log('2. set cabbage:', { error, data });

                            storageGuest.get('foo', (error, data) => {
                                console.log('3. foo should be cabbage: ', { error, data });
                                crel(
                                    instructions,
                                    crel(
                                        'div',
                                        {
                                            style: `color:${data === 'cabbage' ? 'green' : 'red'}`,
                                        },
                                        'foo should be "cabbage"',
                                    ),
                                );

                                storageGuest.remove('foo', (error, data) => {
                                    console.log('4. foo removed: ', { error, data });

                                    storageGuest.get('foo', (error, data) => {
                                        console.log('5. foo should be empty: ', { error, data });
                                        crel(
                                            instructions,
                                            crel(
                                                'div',
                                                { style: `color:${!data ? 'green' : 'red'}` },
                                                'foo should be empty',
                                            ),
                                        );

                                        storageGuest.set('foo', { beep: 'boop' }, (error, data) => {
                                            console.log('6. set an object: ', { error, data });

                                            storageGuest.get('foo', (error, data) => {
                                                console.log('7. foo should be [object Object]: ', { error, data });
                                                crel(
                                                    instructions,
                                                    crel(
                                                        'div',
                                                        {
                                                            style: `color:${
                                                                data === '[object Object]' ? 'green' : 'red'
                                                            }`,
                                                        },
                                                        'foo should be [object Object]',
                                                    ),
                                                );
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });

                /*  eslint-enable */
            },
            { '../../source/guest': 8, crel: 1, 'doc-js': 3 },
        ],
    },
    {},
    [9],
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY3JlbC9jcmVsLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9kb2MuanMiLCJub2RlX21vZHVsZXMvZG9jLWpzL2ZsdWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb2MtanMvZ2V0VGFyZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9nZXRUYXJnZXRzLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9pc0xpc3QuanMiLCJzb3VyY2UvZ2V0SWQuanMiLCJzb3VyY2UvZ3Vlc3QvaW5kZXguanMiLCJ0ZXN0cy9ndWVzdC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDemtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyogQ29weXJpZ2h0IChDKSAyMDEyIEtvcnkgTnVublxyXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcblxyXG5OT1RFOlxyXG5UaGlzIGNvZGUgaXMgZm9ybWF0dGVkIGZvciBydW4tc3BlZWQgYW5kIHRvIGFzc2lzdCBjb21waWxlcnMuXHJcblRoaXMgbWlnaHQgbWFrZSBpdCBoYXJkZXIgdG8gcmVhZCBhdCB0aW1lcywgYnV0IHRoZSBjb2RlJ3MgaW50ZW50aW9uIHNob3VsZCBiZSB0cmFuc3BhcmVudC4gKi9cclxuXHJcbi8vIElJRkUgb3VyIGZ1bmN0aW9uXHJcbigoZXhwb3J0ZXIpID0+IHtcclxuICAgIC8vIERlZmluZSBvdXIgZnVuY3Rpb24gYW5kIGl0cyBwcm9wZXJ0aWVzXHJcbiAgICAvLyBUaGVzZSBzdHJpbmdzIGFyZSB1c2VkIG11bHRpcGxlIHRpbWVzLCBzbyB0aGlzIG1ha2VzIHRoaW5ncyBzbWFsbGVyIG9uY2UgY29tcGlsZWRcclxuICAgIGNvbnN0IGZ1bmMgPSAnZnVuY3Rpb24nLFxyXG4gICAgICAgIGlzTm9kZVN0cmluZyA9ICdpc05vZGUnLFxyXG4gICAgICAgIC8vIEhlbHBlciBmdW5jdGlvbnMgdXNlZCB0aHJvdWdob3V0IHRoZSBzY3JpcHRcclxuICAgICAgICBpc1R5cGUgPSAob2JqZWN0LCB0eXBlKSA9PiB0eXBlb2Ygb2JqZWN0ID09PSB0eXBlLFxyXG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGFwcGVuZHMgY2hpbGRyZW4gdG8gZ2l2ZW4gZWxlbWVudC4gQXMgYSB0ZXh0IG5vZGUgaWYgbm90IGFscmVhZHkgYW4gZWxlbWVudFxyXG4gICAgICAgIGFwcGVuZENoaWxkID0gKGVsZW1lbnQsIGNoaWxkKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjaGlsZCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7IC8vIFN1cHBvcnQgKGRlZXBseSkgbmVzdGVkIGNoaWxkIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQubWFwKHN1YkNoaWxkID0+IGFwcGVuZENoaWxkKGVsZW1lbnQsIHN1YkNoaWxkKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY3JlbFtpc05vZGVTdHJpbmddKGNoaWxkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgLy9cclxuICAgIGZ1bmN0aW9uIGNyZWwgKGVsZW1lbnQsIHNldHRpbmdzKSB7XHJcbiAgICAgICAgLy8gRGVmaW5lIGFsbCB1c2VkIHZhcmlhYmxlcyAvIHNob3J0Y3V0cyBoZXJlLCB0byBtYWtlIHRoaW5ncyBzbWFsbGVyIG9uY2UgY29tcGlsZWRcclxuICAgICAgICBsZXQgYXJncyA9IGFyZ3VtZW50cywgLy8gTm90ZTogYXNzaWduZWQgdG8gYSB2YXJpYWJsZSB0byBhc3Npc3QgY29tcGlsZXJzLlxyXG4gICAgICAgICAgICBpbmRleCA9IDEsXHJcbiAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgYXR0cmlidXRlO1xyXG4gICAgICAgIC8vIElmIGZpcnN0IGFyZ3VtZW50IGlzIGFuIGVsZW1lbnQsIHVzZSBpdCBhcyBpcywgb3RoZXJ3aXNlIHRyZWF0IGl0IGFzIGEgdGFnbmFtZVxyXG4gICAgICAgIGVsZW1lbnQgPSBjcmVsLmlzRWxlbWVudChlbGVtZW50KSA/IGVsZW1lbnQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGVsZW1lbnQpO1xyXG4gICAgICAgIC8vIENoZWNrIGlmIHNlY29uZCBhcmd1bWVudCBpcyBhIHNldHRpbmdzIG9iamVjdFxyXG4gICAgICAgIGlmIChpc1R5cGUoc2V0dGluZ3MsICdvYmplY3QnKSAmJiAhY3JlbFtpc05vZGVTdHJpbmddKHNldHRpbmdzKSAmJiAhQXJyYXkuaXNBcnJheShzZXR0aW5ncykpIHtcclxuICAgICAgICAgICAgLy8gRG9uJ3QgdHJlYXQgc2V0dGluZ3MgYXMgYSBjaGlsZFxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAvLyBHbyB0aHJvdWdoIHNldHRpbmdzIC8gYXR0cmlidXRlcyBvYmplY3QsIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBzZXR0aW5ncykge1xyXG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIGF0dHJpYnV0ZSBpbnRvIGEgdmFyaWFibGUsIGJlZm9yZSB3ZSBwb3RlbnRpYWxseSBtb2RpZnkgdGhlIGtleVxyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlID0gc2V0dGluZ3Nba2V5XTtcclxuICAgICAgICAgICAgICAgIC8vIEdldCBtYXBwZWQga2V5IC8gZnVuY3Rpb24sIGlmIG9uZSBleGlzdHNcclxuICAgICAgICAgICAgICAgIGtleSA9IGNyZWwuYXR0ck1hcFtrZXldIHx8IGtleTtcclxuICAgICAgICAgICAgICAgIC8vIE5vdGU6IFdlIHdhbnQgdG8gcHJpb3JpdGlzZSBtYXBwaW5nIG92ZXIgcHJvcGVydGllc1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzVHlwZShrZXksIGZ1bmMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAga2V5KGVsZW1lbnQsIGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzVHlwZShhdHRyaWJ1dGUsIGZ1bmMpKSB7IC8vIGV4LiBvbkNsaWNrIHByb3BlcnR5XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFtrZXldID0gYXR0cmlidXRlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGVsZW1lbnQgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbGwgYXJndW1lbnRzLCBpZiBhbnksIGFuZCBhcHBlbmQgdGhlbSB0byBvdXIgZWxlbWVudCBpZiB0aGV5J3JlIG5vdCBgbnVsbGBcclxuICAgICAgICBmb3IgKDsgaW5kZXggPCBhcmdzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBhcHBlbmRDaGlsZChlbGVtZW50LCBhcmdzW2luZGV4XSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVc2VkIGZvciBtYXBwaW5nIGF0dHJpYnV0ZSBrZXlzIHRvIHN1cHBvcnRlZCB2ZXJzaW9ucyBpbiBiYWQgYnJvd3NlcnMsIG9yIHRvIGN1c3RvbSBmdW5jdGlvbmFsaXR5XHJcbiAgICBjcmVsLmF0dHJNYXAgPSB7fTtcclxuICAgIGNyZWwuaXNFbGVtZW50ID0gb2JqZWN0ID0+IG9iamVjdCBpbnN0YW5jZW9mIEVsZW1lbnQ7XHJcbiAgICBjcmVsW2lzTm9kZVN0cmluZ10gPSBub2RlID0+IG5vZGUgaW5zdGFuY2VvZiBOb2RlO1xyXG4gICAgLy8gRXhwb3NlIHByb3h5IGludGVyZmFjZVxyXG4gICAgaWYgKHR5cGVvZiBQcm94eSAhPSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgY3JlbC5wcm94eSA9IG5ldyBQcm94eShjcmVsLCB7XHJcbiAgICAgICAgICAgIGdldDogKHRhcmdldCwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAhKGtleSBpbiBjcmVsKSAmJiAoY3JlbFtrZXldID0gY3JlbC5iaW5kKG51bGwsIGtleSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWxba2V5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gRXhwb3J0IGNyZWxcclxuICAgIGV4cG9ydGVyKGNyZWwsIGZ1bmMpO1xyXG59KSgocHJvZHVjdCwgZnVuYykgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIC8vIEV4cG9ydCBmb3IgQnJvd3NlcmlmeSAvIENvbW1vbkpTIGZvcm1hdFxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gcHJvZHVjdDtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gZnVuYyAmJiBkZWZpbmUuYW1kKSB7XHJcbiAgICAgICAgLy8gRXhwb3J0IGZvciBSZXF1aXJlSlMgLyBBTUQgZm9ybWF0XHJcbiAgICAgICAgZGVmaW5lKCgpID0+IHByb2R1Y3QpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBFeHBvcnQgYXMgYSAnZ2xvYmFsJyBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMuY3JlbCA9IHByb2R1Y3Q7XHJcbiAgICB9XHJcbn0pO1xyXG4iLCJ2YXIgZG9jID0ge1xyXG4gICAgZG9jdW1lbnQ6IHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudCA6IG51bGwsXHJcbiAgICBzZXREb2N1bWVudDogZnVuY3Rpb24oZCl7XHJcbiAgICAgICAgdGhpcy5kb2N1bWVudCA9IGQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgYXJyYXlQcm90byA9IFtdLFxyXG4gICAgaXNMaXN0ID0gcmVxdWlyZSgnLi9pc0xpc3QnKSxcclxuICAgIGdldFRhcmdldHMgPSByZXF1aXJlKCcuL2dldFRhcmdldHMnKShkb2MuZG9jdW1lbnQpLFxyXG4gICAgZ2V0VGFyZ2V0ID0gcmVxdWlyZSgnLi9nZXRUYXJnZXQnKShkb2MuZG9jdW1lbnQpLFxyXG4gICAgc3BhY2UgPSAnICc7XHJcblxyXG5cclxuLy8vW1JFQURNRS5tZF1cclxuXHJcbmZ1bmN0aW9uIGlzSW4oYXJyYXksIGl0ZW0pe1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYoaXRlbSA9PT0gYXJyYXlbaV0pe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5maW5kXHJcblxyXG4gICAgZmluZHMgZWxlbWVudHMgdGhhdCBtYXRjaCB0aGUgcXVlcnkgd2l0aGluIHRoZSBzY29wZSBvZiB0YXJnZXRcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5maW5kKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuZmluZCh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGZpbmQodGFyZ2V0LCBxdWVyeSl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcbiAgICBpZihxdWVyeSA9PSBudWxsKXtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBzdWJSZXN1bHRzID0gZG9jLmZpbmQodGFyZ2V0W2ldLCBxdWVyeSk7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBzdWJSZXN1bHRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZighaXNJbihyZXN1bHRzLCBzdWJSZXN1bHRzW2pdKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHN1YlJlc3VsdHNbal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXQgPyB0YXJnZXQucXVlcnlTZWxlY3RvckFsbChxdWVyeSkgOiBbXTtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmZpbmRPbmVcclxuXHJcbiAgICBmaW5kcyB0aGUgZmlyc3QgZWxlbWVudCB0aGF0IG1hdGNoZXMgdGhlIHF1ZXJ5IHdpdGhpbiB0aGUgc2NvcGUgb2YgdGFyZ2V0XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuZmluZE9uZShxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmZpbmRPbmUodGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBmaW5kT25lKHRhcmdldCwgcXVlcnkpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCk7XHJcbiAgICBpZihxdWVyeSA9PSBudWxsKXtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB2YXIgcmVzdWx0O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGZpbmRPbmUodGFyZ2V0W2ldLCBxdWVyeSk7XHJcbiAgICAgICAgICAgIGlmKHJlc3VsdCl7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXQgPyB0YXJnZXQucXVlcnlTZWxlY3RvcihxdWVyeSkgOiBudWxsO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuY2xvc2VzdFxyXG5cclxuICAgIHJlY3Vyc2VzIHVwIHRoZSBET00gZnJvbSB0aGUgdGFyZ2V0IG5vZGUsIGNoZWNraW5nIGlmIHRoZSBjdXJyZW50IGVsZW1lbnQgbWF0Y2hlcyB0aGUgcXVlcnlcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5jbG9zZXN0KHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuY2xvc2VzdCh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGNsb3Nlc3QodGFyZ2V0LCBxdWVyeSl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKFxyXG4gICAgICAgIHRhcmdldCAmJlxyXG4gICAgICAgIHRhcmdldC5vd25lckRvY3VtZW50ICYmXHJcbiAgICAgICAgIWlzKHRhcmdldCwgcXVlcnkpXHJcbiAgICApe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXQgPT09IGRvYy5kb2N1bWVudCAmJiB0YXJnZXQgIT09IHF1ZXJ5ID8gbnVsbCA6IHRhcmdldDtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmlzXHJcblxyXG4gICAgcmV0dXJucyB0cnVlIGlmIHRoZSB0YXJnZXQgZWxlbWVudCBtYXRjaGVzIHRoZSBxdWVyeVxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmlzKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuaXModGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBpcyh0YXJnZXQsIHF1ZXJ5KXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIXRhcmdldC5vd25lckRvY3VtZW50IHx8IHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycpe1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQgPT09IHF1ZXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHRhcmdldCA9PT0gcXVlcnkpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXJlbnRsZXNzID0gIXRhcmdldC5wYXJlbnROb2RlO1xyXG5cclxuICAgIGlmKHBhcmVudGxlc3Mpe1xyXG4gICAgICAgIC8vIEdpdmUgdGhlIGVsZW1lbnQgYSBwYXJlbnQgc28gdGhhdCAucXVlcnlTZWxlY3RvckFsbCBjYW4gYmUgdXNlZFxyXG4gICAgICAgIGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKS5hcHBlbmRDaGlsZCh0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZXN1bHQgPSBhcnJheVByb3RvLmluZGV4T2YuY2FsbChmaW5kKHRhcmdldC5wYXJlbnROb2RlLCBxdWVyeSksIHRhcmdldCkgPj0gMDtcclxuXHJcbiAgICBpZihwYXJlbnRsZXNzKXtcclxuICAgICAgICB0YXJnZXQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5hZGRDbGFzc1xyXG5cclxuICAgIGFkZHMgY2xhc3NlcyB0byB0aGUgdGFyZ2V0IChzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9yIGFycmF5KVxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmFkZENsYXNzKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuYWRkQ2xhc3ModGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBhZGRDbGFzcyh0YXJnZXQsIGNsYXNzZXMpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhZGRDbGFzcyh0YXJnZXRbaV0sIGNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGlmKCFjbGFzc2VzKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2xhc3NlcyA9IEFycmF5LmlzQXJyYXkoY2xhc3NlcykgPyBjbGFzc2VzIDogY2xhc3Nlcy5zcGxpdChzcGFjZSksXHJcbiAgICAgICAgY3VycmVudENsYXNzZXMgPSB0YXJnZXQuY2xhc3NMaXN0ID8gbnVsbCA6IHRhcmdldC5jbGFzc05hbWUuc3BsaXQoc3BhY2UpO1xyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgY2xhc3NUb0FkZCA9IGNsYXNzZXNbaV07XHJcbiAgICAgICAgaWYoIWNsYXNzVG9BZGQgfHwgY2xhc3NUb0FkZCA9PT0gc3BhY2Upe1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0LmNsYXNzTGlzdCl7XHJcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGNsYXNzVG9BZGQpO1xyXG4gICAgICAgIH0gZWxzZSBpZighY3VycmVudENsYXNzZXMuaW5kZXhPZihjbGFzc1RvQWRkKT49MCl7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzc2VzLnB1c2goY2xhc3NUb0FkZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoIXRhcmdldC5jbGFzc0xpc3Qpe1xyXG4gICAgICAgIHRhcmdldC5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKHNwYWNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAucmVtb3ZlQ2xhc3NcclxuXHJcbiAgICByZW1vdmVzIGNsYXNzZXMgZnJvbSB0aGUgdGFyZ2V0IChzcGFjZSBzZXBhcmF0ZWQgc3RyaW5nIG9yIGFycmF5KVxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLnJlbW92ZUNsYXNzKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MucmVtb3ZlQ2xhc3ModGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiByZW1vdmVDbGFzcyh0YXJnZXQsIGNsYXNzZXMpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyh0YXJnZXRbaV0sIGNsYXNzZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZighY2xhc3Nlcyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNsYXNzZXMgPSBBcnJheS5pc0FycmF5KGNsYXNzZXMpID8gY2xhc3NlcyA6IGNsYXNzZXMuc3BsaXQoc3BhY2UpLFxyXG4gICAgICAgIGN1cnJlbnRDbGFzc2VzID0gdGFyZ2V0LmNsYXNzTGlzdCA/IG51bGwgOiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KHNwYWNlKTtcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIGNsYXNzVG9SZW1vdmUgPSBjbGFzc2VzW2ldO1xyXG4gICAgICAgIGlmKCFjbGFzc1RvUmVtb3ZlIHx8IGNsYXNzVG9SZW1vdmUgPT09IHNwYWNlKXtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5jbGFzc0xpc3Qpe1xyXG4gICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc1RvUmVtb3ZlKTtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZW1vdmVJbmRleCA9IGN1cnJlbnRDbGFzc2VzLmluZGV4T2YoY2xhc3NUb1JlbW92ZSk7XHJcbiAgICAgICAgaWYocmVtb3ZlSW5kZXggPj0gMCl7XHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzc2VzLnNwbGljZShyZW1vdmVJbmRleCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoIXRhcmdldC5jbGFzc0xpc3Qpe1xyXG4gICAgICAgIHRhcmdldC5jbGFzc05hbWUgPSBjdXJyZW50Q2xhc3Nlcy5qb2luKHNwYWNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRFdmVudChzZXR0aW5ncyl7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHNldHRpbmdzLnRhcmdldCk7XHJcbiAgICBpZih0YXJnZXQpe1xyXG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHNldHRpbmdzLmV2ZW50LCBzZXR0aW5ncy5jYWxsYmFjaywgZmFsc2UpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdObyBlbGVtZW50cyBtYXRjaGVkIHRoZSBzZWxlY3Rvciwgc28gbm8gZXZlbnRzIHdlcmUgYm91bmQuJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5vblxyXG5cclxuICAgIGJpbmRzIGEgY2FsbGJhY2sgdG8gYSB0YXJnZXQgd2hlbiBhIERPTSBldmVudCBpcyByYWlzZWQuXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldC9wcm94eSkub24oZXZlbnRzLCB0YXJnZXRbb3B0aW9uYWxdLCBjYWxsYmFjayk7XHJcblxyXG4gICAgbm90ZTogaWYgYSB0YXJnZXQgaXMgcGFzc2VkIHRvIHRoZSAub24gZnVuY3Rpb24sIGRvYydzIHRhcmdldCB3aWxsIGJlIHVzZWQgYXMgdGhlIHByb3h5LlxyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5vbihldmVudHMsIHRhcmdldCwgcXVlcnksIHByb3h5W29wdGlvbmFsXSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBvbihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5KXtcclxuXHJcbiAgICBwcm94eSA9IGdldFRhcmdldHMocHJveHkpO1xyXG5cclxuICAgIGlmKCFwcm94eSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG4gICAgICAgIC8vIGhhbmRsZXMgbXVsdGlwbGUgdGFyZ2V0c1xyXG4gICAgICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICAgICAgdmFyIG11bHRpUmVtb3ZlQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBtdWx0aVJlbW92ZUNhbGxiYWNrcy5wdXNoKG9uKGV2ZW50cywgdGFyZ2V0W2ldLCBjYWxsYmFjaywgcHJveHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHdoaWxlKG11bHRpUmVtb3ZlQ2FsbGJhY2tzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbXVsdGlSZW1vdmVDYWxsYmFja3MucG9wKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGhhbmRsZXMgbXVsdGlwbGUgcHJveGllc1xyXG4gICAgLy8gQWxyZWFkeSBoYW5kbGVzIG11bHRpcGxlIHByb3hpZXMgYW5kIHRhcmdldHMsXHJcbiAgICAvLyBiZWNhdXNlIHRoZSB0YXJnZXQgbG9vcCBjYWxscyB0aGlzIGxvb3AuXHJcbiAgICBpZihpc0xpc3QocHJveHkpKXtcclxuICAgICAgICB2YXIgbXVsdGlSZW1vdmVDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3h5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG11bHRpUmVtb3ZlQ2FsbGJhY2tzLnB1c2gob24oZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eVtpXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgd2hpbGUobXVsdGlSZW1vdmVDYWxsYmFja3MubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIG11bHRpUmVtb3ZlQ2FsbGJhY2tzLnBvcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVtb3ZlQ2FsbGJhY2tzID0gW107XHJcblxyXG4gICAgaWYodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChzcGFjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIGV2ZW50U2V0dGluZ3MgPSB7fTtcclxuICAgICAgICBpZihwcm94eSl7XHJcbiAgICAgICAgICAgIGlmKHByb3h5ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHByb3h5ID0gZG9jLmRvY3VtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGV2ZW50U2V0dGluZ3MudGFyZ2V0ID0gcHJveHk7XHJcbiAgICAgICAgICAgIGV2ZW50U2V0dGluZ3MuY2FsbGJhY2sgPSBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xvc2VzdFRhcmdldCA9IGNsb3Nlc3QoZXZlbnQudGFyZ2V0LCB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgaWYoY2xvc2VzdFRhcmdldCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXZlbnQsIGNsb3Nlc3RUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBldmVudFNldHRpbmdzLnRhcmdldCA9IHRhcmdldDtcclxuICAgICAgICAgICAgZXZlbnRTZXR0aW5ncy5jYWxsYmFjayA9IGNhbGxiYWNrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZXZlbnRTZXR0aW5ncy5ldmVudCA9IGV2ZW50c1tpXTtcclxuXHJcbiAgICAgICAgYWRkRXZlbnQoZXZlbnRTZXR0aW5ncyk7XHJcblxyXG4gICAgICAgIHJlbW92ZUNhbGxiYWNrcy5wdXNoKGV2ZW50U2V0dGluZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHdoaWxlKHJlbW92ZUNhbGxiYWNrcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICB2YXIgcmVtb3ZlQ2FsbGJhY2sgPSByZW1vdmVDYWxsYmFja3MucG9wKCk7XHJcbiAgICAgICAgICAgIGdldFRhcmdldChyZW1vdmVDYWxsYmFjay50YXJnZXQpLnJlbW92ZUV2ZW50TGlzdGVuZXIocmVtb3ZlQ2FsbGJhY2suZXZlbnQsIHJlbW92ZUNhbGxiYWNrLmNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5vZmZcclxuXHJcbiAgICByZW1vdmVzIGV2ZW50cyBhc3NpZ25lZCB0byBhIHRhcmdldC5cclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0L3Byb3h5KS5vZmYoZXZlbnRzLCB0YXJnZXRbb3B0aW9uYWxdLCBjYWxsYmFjayk7XHJcblxyXG4gICAgbm90ZTogaWYgYSB0YXJnZXQgaXMgcGFzc2VkIHRvIHRoZSAub24gZnVuY3Rpb24sIGRvYydzIHRhcmdldCB3aWxsIGJlIHVzZWQgYXMgdGhlIHByb3h5LlxyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5vZmYoZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBvZmYoZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eSl7XHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgb2ZmKGV2ZW50cywgdGFyZ2V0W2ldLCBjYWxsYmFjaywgcHJveHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIGlmKHByb3h5IGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJveHkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgb2ZmKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHlbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KHNwYWNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgIHByb3h5ID0gY2FsbGJhY2s7XHJcbiAgICAgICAgY2FsbGJhY2sgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3h5ID0gcHJveHkgPyBnZXRUYXJnZXQocHJveHkpIDogZG9jLmRvY3VtZW50O1xyXG5cclxuICAgIHZhciB0YXJnZXRzID0gdHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycgPyBmaW5kKHRhcmdldCwgcHJveHkpIDogW3RhcmdldF07XHJcblxyXG4gICAgZm9yKHZhciB0YXJnZXRJbmRleCA9IDA7IHRhcmdldEluZGV4IDwgdGFyZ2V0cy5sZW5ndGg7IHRhcmdldEluZGV4Kyspe1xyXG4gICAgICAgIHZhciBjdXJyZW50VGFyZ2V0ID0gdGFyZ2V0c1t0YXJnZXRJbmRleF07XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjdXJyZW50VGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2ldLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5hcHBlbmRcclxuXHJcbiAgICBhZGRzIGVsZW1lbnRzIHRvIGEgdGFyZ2V0XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuYXBwZW5kKGNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuYXBwZW5kKHRhcmdldCwgY2hpbGRyZW4pO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gYXBwZW5kKHRhcmdldCwgY2hpbGRyZW4pe1xyXG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpLFxyXG4gICAgICAgIGNoaWxkcmVuID0gZ2V0VGFyZ2V0KGNoaWxkcmVuKTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGlzTGlzdChjaGlsZHJlbikpe1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYXBwZW5kKHRhcmdldCwgY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGFyZ2V0LmFwcGVuZENoaWxkKGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLnByZXBlbmRcclxuXHJcbiAgICBhZGRzIGVsZW1lbnRzIHRvIHRoZSBmcm9udCBvZiBhIHRhcmdldFxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLnByZXBlbmQoY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5wcmVwZW5kKHRhcmdldCwgY2hpbGRyZW4pO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gcHJlcGVuZCh0YXJnZXQsIGNoaWxkcmVuKXtcclxuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KSxcclxuICAgICAgICBjaGlsZHJlbiA9IGdldFRhcmdldChjaGlsZHJlbik7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFswXTtcclxuICAgIH1cclxuXHJcbiAgICBpZihpc0xpc3QoY2hpbGRyZW4pKXtcclxuICAgICAgICAvL3JldmVyc2VkIGJlY2F1c2Ugb3RoZXJ3aXNlIHRoZSB3b3VsZCBnZXQgcHV0IGluIGluIHRoZSB3cm9uZyBvcmRlci5cclxuICAgICAgICBmb3IgKHZhciBpID0gY2hpbGRyZW4ubGVuZ3RoIC0xOyBpOyBpLS0pIHtcclxuICAgICAgICAgICAgcHJlcGVuZCh0YXJnZXQsIGNoaWxkcmVuW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldC5pbnNlcnRCZWZvcmUoY2hpbGRyZW4sIHRhcmdldC5maXJzdENoaWxkKTtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmlzVmlzaWJsZVxyXG5cclxuICAgIGNoZWNrcyBpZiBhbiBlbGVtZW50IG9yIGFueSBvZiBpdHMgcGFyZW50cyBkaXNwbGF5IHByb3BlcnRpZXMgYXJlIHNldCB0byAnbm9uZSdcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5pc1Zpc2libGUoKTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuaXNWaXNpYmxlKHRhcmdldCk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBpc1Zpc2libGUodGFyZ2V0KXtcclxuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KTtcclxuICAgIGlmKCF0YXJnZXQpe1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB2YXIgaSA9IC0xO1xyXG5cclxuICAgICAgICB3aGlsZSAodGFyZ2V0W2krK10gJiYgaXNWaXNpYmxlKHRhcmdldFtpXSkpIHt9XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldC5sZW5ndGggPj0gaTtcclxuICAgIH1cclxuICAgIHdoaWxlKHRhcmdldC5wYXJlbnROb2RlICYmIHRhcmdldC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXQgPT09IGRvYy5kb2N1bWVudDtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmluZGV4T2ZFbGVtZW50XHJcblxyXG4gICAgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGVsZW1lbnQgd2l0aGluIGl0J3MgcGFyZW50IGVsZW1lbnQuXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuaW5kZXhPZkVsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuaW5kZXhPZkVsZW1lbnQodGFyZ2V0KTtcclxuXHJcbiovXHJcblxyXG5mdW5jdGlvbiBpbmRleE9mRWxlbWVudCh0YXJnZXQpIHtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuICAgIGlmKCF0YXJnZXQpe1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpID0gLTE7XHJcblxyXG4gICAgdmFyIHBhcmVudCA9IHRhcmdldC5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgIGlmKCFwYXJlbnQpe1xyXG4gICAgICAgIHJldHVybiBpO1xyXG4gICAgfVxyXG5cclxuICAgIHdoaWxlKHBhcmVudC5jaGlsZHJlblsrK2ldICE9PSB0YXJnZXQpe31cclxuXHJcbiAgICByZXR1cm4gaTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5yZWFkeVxyXG5cclxuICAgIGNhbGwgYSBjYWxsYmFjayB3aGVuIHRoZSBkb2N1bWVudCBpcyByZWFkeS5cclxuXHJcbiAgICByZXR1cm5zIC0xIGlmIHRoZXJlIGlzIG5vIHBhcmVudEVsZW1lbnQgb24gdGhlIHRhcmdldC5cclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2MoKS5yZWFkeShjYWxsYmFjayk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLnJlYWR5KGNhbGxiYWNrKTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHJlYWR5KGNhbGxiYWNrKXtcclxuICAgIGlmKGRvYy5kb2N1bWVudCAmJiAoZG9jLmRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScgfHwgZG9jLmRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdpbnRlcmFjdGl2ZScpKXtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgfWVsc2UgaWYod2luZG93LmF0dGFjaEV2ZW50KXtcclxuICAgICAgICBkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLCBjYWxsYmFjayk7XHJcbiAgICAgICAgd2luZG93LmF0dGFjaEV2ZW50KFwib25Mb2FkXCIsY2FsbGJhY2spO1xyXG4gICAgfWVsc2UgaWYoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcil7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjYWxsYmFjayxmYWxzZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRvYy5maW5kID0gZmluZDtcclxuZG9jLmZpbmRPbmUgPSBmaW5kT25lO1xyXG5kb2MuY2xvc2VzdCA9IGNsb3Nlc3Q7XHJcbmRvYy5pcyA9IGlzO1xyXG5kb2MuYWRkQ2xhc3MgPSBhZGRDbGFzcztcclxuZG9jLnJlbW92ZUNsYXNzID0gcmVtb3ZlQ2xhc3M7XHJcbmRvYy5vZmYgPSBvZmY7XHJcbmRvYy5vbiA9IG9uO1xyXG5kb2MuYXBwZW5kID0gYXBwZW5kO1xyXG5kb2MucHJlcGVuZCA9IHByZXBlbmQ7XHJcbmRvYy5pc1Zpc2libGUgPSBpc1Zpc2libGU7XHJcbmRvYy5yZWFkeSA9IHJlYWR5O1xyXG5kb2MuaW5kZXhPZkVsZW1lbnQgPSBpbmRleE9mRWxlbWVudDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jOyIsInZhciBkb2MgPSByZXF1aXJlKCcuL2RvYycpLFxyXG4gICAgaXNMaXN0ID0gcmVxdWlyZSgnLi9pc0xpc3QnKSxcclxuICAgIGdldFRhcmdldHMgPSByZXF1aXJlKCcuL2dldFRhcmdldHMnKShkb2MuZG9jdW1lbnQpLFxyXG4gICAgZmxvY1Byb3RvID0gW107XHJcblxyXG5mdW5jdGlvbiBGbG9jKGl0ZW1zKXtcclxuICAgIHRoaXMucHVzaC5hcHBseSh0aGlzLCBpdGVtcyk7XHJcbn1cclxuRmxvYy5wcm90b3R5cGUgPSBmbG9jUHJvdG87XHJcbmZsb2NQcm90by5jb25zdHJ1Y3RvciA9IEZsb2M7XHJcblxyXG5mdW5jdGlvbiBmbG9jKHRhcmdldCl7XHJcbiAgICB2YXIgaW5zdGFuY2UgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcblxyXG4gICAgaWYoIWlzTGlzdChpbnN0YW5jZSkpe1xyXG4gICAgICAgIGlmKGluc3RhbmNlKXtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSBbaW5zdGFuY2VdO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRmxvYyhpbnN0YW5jZSk7XHJcbn1cclxuXHJcbnZhciByZXR1cm5zU2VsZiA9ICdhZGRDbGFzcyByZW1vdmVDbGFzcyBhcHBlbmQgcHJlcGVuZCcuc3BsaXQoJyAnKTtcclxuXHJcbmZvcih2YXIga2V5IGluIGRvYyl7XHJcbiAgICBpZih0eXBlb2YgZG9jW2tleV0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgIGZsb2Nba2V5XSA9IGRvY1trZXldO1xyXG4gICAgICAgIGZsb2NQcm90b1trZXldID0gKGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgYWxzbyBleHRyZW1lbHkgZG9kZ3kgYW5kIGZhc3RcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQsZSxmKXtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBkb2Nba2V5XSh0aGlzLCBhLGIsYyxkLGUsZik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYocmVzdWx0ICE9PSBkb2MgJiYgaXNMaXN0KHJlc3VsdCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbG9jKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihyZXR1cm5zU2VsZi5pbmRleE9mKGtleSkgPj0wKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0oa2V5KSk7XHJcbiAgICB9XHJcbn1cclxuZmxvY1Byb3RvLm9uID0gZnVuY3Rpb24oZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrKXtcclxuICAgIHZhciBwcm94eSA9IHRoaXM7XHJcbiAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICBjYWxsYmFjayA9IHRhcmdldDtcclxuICAgICAgICB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgIHByb3h5ID0gbnVsbDtcclxuICAgIH1cclxuICAgIGRvYy5vbihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5KTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuZmxvY1Byb3RvLm9mZiA9IGZ1bmN0aW9uKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjayl7XHJcbiAgICB2YXIgcmVmZXJlbmNlID0gdGhpcztcclxuICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgIGNhbGxiYWNrID0gdGFyZ2V0O1xyXG4gICAgICAgIHRhcmdldCA9IHRoaXM7XHJcbiAgICAgICAgcmVmZXJlbmNlID0gbnVsbDtcclxuICAgIH1cclxuICAgIGRvYy5vZmYoZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCByZWZlcmVuY2UpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5mbG9jUHJvdG8ucmVhZHkgPSBmdW5jdGlvbihjYWxsYmFjayl7XHJcbiAgICBkb2MucmVhZHkoY2FsbGJhY2spO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5mbG9jUHJvdG8uYWRkQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpe1xyXG4gICAgZG9jLmFkZENsYXNzKHRoaXMsIGNsYXNzTmFtZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbmZsb2NQcm90by5yZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSl7XHJcbiAgICBkb2MucmVtb3ZlQ2xhc3ModGhpcywgY2xhc3NOYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmbG9jOyIsInZhciBzaW5nbGVJZCA9IC9eI1xcdyskLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb2N1bWVudCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpe1xuICAgICAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBpZihzaW5nbGVJZC5leGVjKHRhcmdldCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXQuc2xpY2UoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn07IiwiXG52YXIgc2luZ2xlQ2xhc3MgPSAvXlxcLlxcdyskLyxcbiAgICBzaW5nbGVJZCA9IC9eI1xcdyskLyxcbiAgICBzaW5nbGVUYWcgPSAvXlxcdyskLztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkb2N1bWVudCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGdldFRhcmdldHModGFyZ2V0KXtcbiAgICAgICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgaWYoc2luZ2xlSWQuZXhlYyh0YXJnZXQpKXtcbiAgICAgICAgICAgICAgICAvLyBJZiB5b3UgaGF2ZSBtb3JlIHRoYW4gMSBvZiB0aGUgc2FtZSBpZCBpbiB5b3VyIHBhZ2UsXG4gICAgICAgICAgICAgICAgLy8gdGhhdHMgeW91ciBvd24gc3R1cGlkIGZhdWx0LlxuICAgICAgICAgICAgICAgIHJldHVybiBbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0LnNsaWNlKDEpKV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzaW5nbGVUYWcuZXhlYyh0YXJnZXQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHNpbmdsZUNsYXNzLmV4ZWModGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUodGFyZ2V0LnNsaWNlKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNMaXN0KG9iamVjdCl7XHJcbiAgICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgJ2xlbmd0aCcgaW4gb2JqZWN0ICYmICEoJ25vZGVUeXBlJyBpbiBvYmplY3QpICYmIG9iamVjdC5zZWxmICE9IG9iamVjdDsgLy8gaW4gSUU4LCB3aW5kb3cuc2VsZiBpcyB3aW5kb3csIGJ1dCBpdCBpcyBub3QgPT09IHdpbmRvdywgYnV0IGl0IGlzID09IHdpbmRvdy4uLi4uLi4uLiBXVEYhP1xyXG59IiwiY29uc3QgcHJlZml4ID0gJ3Nlc3Npb25BY2Nlc3NJZC0nO1xuXG5mdW5jdGlvbiBnZXRJZChkYXRhKSB7XG4gICAgbGV0IGlkO1xuXG4gICAgaWYgKGRhdGEgJiYgZGF0YS5pZCAmJiB+ZGF0YS5pZC5pbmRleE9mKHByZWZpeCkpIHtcbiAgICAgICAgaWQgPSBkYXRhLmlkO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRJZDtcbiIsImNvbnN0IGdldElkID0gcmVxdWlyZSgnLi4vZ2V0SWQnKTtcblxuY29uc3QgcHJlZml4ID0gJ3Nlc3Npb25BY2Nlc3NJZC0nO1xuXG5mdW5jdGlvbiBjcmVhdGVJZCgpIHtcbiAgICByZXR1cm4gcHJlZml4ICsgRGF0ZS5ub3coKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzdG9yYWdlR3Vlc3Qoc291cmNlLCBwYXJlbnQpIHtcbiAgICBwYXJlbnQgPSBwYXJlbnQgfHwgZG9jdW1lbnQuYm9keTtcblxuICAgIGxldCBjb250ZW50V2luZG93O1xuICAgIGxldCBjYWxsYmFja3MgPSB7fTtcbiAgICBjb25zdCBzZXNzaW9uUmVxdWVzdHMgPSBbXTtcbiAgICBsZXQgY29ubmVjdGVkID0gZmFsc2U7XG4gICAgbGV0IGNsb3NlZCA9IHRydWU7XG4gICAgbGV0IGNvbm5lY3RlZFRpbWVvdXQ7XG4gICAgbGV0IGlzTG9hZGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgICBpZnJhbWUuc3JjID0gc291cmNlO1xuICAgIGlmcmFtZS53aWR0aCA9IDA7XG4gICAgaWZyYW1lLmhlaWdodCA9IDA7XG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgaWZyYW1lLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgaXNMb2FkZWQgPSB0cnVlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBvcGVuU3RvcmFnZSgpIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gICAgICAgIGNvbnRlbnRXaW5kb3cgPSBpZnJhbWUuY29udGVudFdpbmRvdztcbiAgICAgICAgY2xvc2VkID0gZmFsc2U7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKTtcblxuICAgICAgICBjaGVja0Nvbm5lY3RlZCgpO1xuICAgIH1cblxuICAgIG9wZW5TdG9yYWdlKCk7XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbkFjY2Vzc0lkID0gZ2V0SWQocmVzcG9uc2UpO1xuXG4gICAgICAgIGlmIChzZXNzaW9uQWNjZXNzSWQgPT09ICdzZXNzaW9uQWNjZXNzSWQtY29ubmVjdGVkJykge1xuICAgICAgICAgICAgY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXNwb25zZS5jb25uZWN0RXJyb3IpIHtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGNhbGxiYWNrcykuZm9yRWFjaCgoa2V5KSA9PiBjYWxsYmFja3Nba2V5XShyZXNwb25zZS5lcnJvcikpO1xuICAgICAgICAgICAgY2FsbGJhY2tzID0ge307XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjYWxsYmFjayA9IGNhbGxiYWNrc1tzZXNzaW9uQWNjZXNzSWRdO1xuXG4gICAgICAgIGlmIChzZXNzaW9uQWNjZXNzSWQgJiYgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKHJlc3BvbnNlLmVycm9yLCByZXNwb25zZS5kYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoY29ubmVjdGVkVGltZW91dCk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgaGFuZGxlTWVzc2FnZSk7XG4gICAgICAgIGlmcmFtZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gICAgICAgIGNvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICBjbG9zZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1lc3NhZ2UobWV0aG9kLCBrZXksIHZhbHVlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoY2xvc2VkKSB7XG4gICAgICAgICAgICBvcGVuU3RvcmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb25uZWN0ZWQgJiYgbWV0aG9kICE9PSAnY29ubmVjdCcpIHtcbiAgICAgICAgICAgIHNlc3Npb25SZXF1ZXN0cy5wdXNoKFttZXRob2QsIGtleSwgdmFsdWUsIGNhbGxiYWNrXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpZCA9IGNyZWF0ZUlkKCk7XG5cbiAgICAgICAgaWYgKGNhbGxiYWNrcyAmJiB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0xvYWRlZCkge1xuICAgICAgICAgICAgY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzb3VyY2UsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0KGtleSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYWxsYmFjayByZXF1aXJlZCBmb3IgZ2V0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICBtZXNzYWdlKCdnZXQnLCBrZXksIG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbWVzc2FnZSgnc2V0Jywga2V5LCB2YWx1ZSwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZShrZXksIGNhbGxiYWNrKSB7XG4gICAgICAgIG1lc3NhZ2UoJ3JlbW92ZScsIGtleSwgbnVsbCwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrQ29ubmVjdGVkKCkge1xuICAgICAgICBpZiAoY29ubmVjdGVkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoY29ubmVjdGVkVGltZW91dCk7XG4gICAgICAgICAgICB3aGlsZSAoc2Vzc2lvblJlcXVlc3RzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UoLi4uc2Vzc2lvblJlcXVlc3RzLnBvcCgpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWVzc2FnZSgnY29ubmVjdCcpO1xuXG4gICAgICAgIGNvbm5lY3RlZFRpbWVvdXQgPSBzZXRUaW1lb3V0KGNoZWNrQ29ubmVjdGVkLCAxMjUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldCxcbiAgICAgICAgc2V0LFxuICAgICAgICByZW1vdmUsXG4gICAgICAgIGNsb3NlLFxuICAgIH07XG59O1xuIiwiY29uc3QgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbmNvbnN0IGRvYyA9IHJlcXVpcmUoJ2RvYy1qcycpO1xuY29uc3QgY3JlYXRlU3RvcmFnZUd1ZXN0ID0gcmVxdWlyZSgnLi4vLi4vc291cmNlL2d1ZXN0Jyk7XG5cbmNvbnN0IGluc3RydWN0aW9ucyA9IGNyZWwoJ2RpdicsIGNyZWwoJ2gzJywgJ2Nyb3NzLWRvbWFpbi1zdG9yYWdlIGd1ZXN0JyksICdJZiBub3QgYWxsIGdyZWVuIHRoZW4gdmlldyB0aGUgY29uc29sZS4nKTtcblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuLy8gVE9ETzogTWFrZSBhY3R1YWx5IHRlc3RzIG5vdCBqdXN0IHRoaXMgbmVzdGVkIG5pZ2h0bWFyZVxuZG9jLnJlYWR5KCgpID0+IHtcbiAgICBjcmVsKGRvY3VtZW50LmJvZHksIGluc3RydWN0aW9ucyk7XG4gICAgY29uc3Qgc3RvcmFnZUd1ZXN0ID0gY3JlYXRlU3RvcmFnZUd1ZXN0KCdodHRwOi8vbG9jYWxob3N0OjkxMjMnKTtcblxuICAgIHN0b3JhZ2VHdWVzdC5nZXQoJ2ZvbycsIChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnMS4gZm9vIHNob3VsZCBiZSBiYXI6ICcsIHsgZXJyb3IsIGRhdGEgfSk7XG4gICAgICAgIGNyZWwoaW5zdHJ1Y3Rpb25zLCBjcmVsKCdkaXYnLCB7IHN0eWxlOiBgY29sb3I6JHtkYXRhID09PSAnYmFyJyA/ICdncmVlbicgOiAncmVkJ31gIH0sICdmb28gc2hvdWxkIGJlIFwiYmFyXCInKSk7XG5cbiAgICAgICAgc3RvcmFnZUd1ZXN0LnNldCgnZm9vJywgJ2NhYmJhZ2UnLCAoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcyLiBzZXQgY2FiYmFnZTonLCB7IGVycm9yLCBkYXRhIH0pO1xuXG4gICAgICAgICAgICBzdG9yYWdlR3Vlc3QuZ2V0KCdmb28nLCAoZXJyb3IsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnMy4gZm9vIHNob3VsZCBiZSBjYWJiYWdlOiAnLCB7IGVycm9yLCBkYXRhIH0pO1xuICAgICAgICAgICAgICAgIGNyZWwoXG4gICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgY3JlbChcbiAgICAgICAgICAgICAgICAgICAgICAgICdkaXYnLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBgY29sb3I6JHtkYXRhID09PSAnY2FiYmFnZScgPyAnZ3JlZW4nIDogJ3JlZCd9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnZm9vIHNob3VsZCBiZSBcImNhYmJhZ2VcIicsXG4gICAgICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHN0b3JhZ2VHdWVzdC5yZW1vdmUoJ2ZvbycsIChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnNC4gZm9vIHJlbW92ZWQ6ICcsIHsgZXJyb3IsIGRhdGEgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUd1ZXN0LmdldCgnZm9vJywgKGVycm9yLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnNS4gZm9vIHNob3VsZCBiZSBlbXB0eTogJywgeyBlcnJvciwgZGF0YSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNyZWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdHJ1Y3Rpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWwoJ2RpdicsIHsgc3R5bGU6IGBjb2xvcjokeyFkYXRhID8gJ2dyZWVuJyA6ICdyZWQnfWAgfSwgJ2ZvbyBzaG91bGQgYmUgZW1wdHknKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JhZ2VHdWVzdC5zZXQoJ2ZvbycsIHsgYmVlcDogJ2Jvb3AnIH0sIChlcnJvciwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc2LiBzZXQgYW4gb2JqZWN0OiAnLCB7IGVycm9yLCBkYXRhIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmFnZUd1ZXN0LmdldCgnZm9vJywgKGVycm9yLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc3LiBmb28gc2hvdWxkIGJlIFtvYmplY3QgT2JqZWN0XTogJywgeyBlcnJvciwgZGF0YSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3RydWN0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNyZWwoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2RpdicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBzdHlsZTogYGNvbG9yOiR7ZGF0YSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnZ3JlZW4nIDogJ3JlZCd9YCB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdmb28gc2hvdWxkIGJlIFtvYmplY3QgT2JqZWN0XScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG5cbi8qICBlc2xpbnQtZW5hYmxlICovXG4iXX0=
