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
                const methods = require('./methods');

                module.exports = function storageHost(allowedDomains) {
                    function handleMessage(event) {
                        const { data } = event;
                        const origin = event.origin || '';

                        const domain = allowedDomains.find(
                            (allowedDomain) => origin === allowedDomain.origin || origin.match(allowedDomain.origin),
                        );

                        const id = getId(data);

                        if (!id) {
                            return;
                        }

                        if (!domain) {
                            event.source.postMessage(
                                {
                                    id,
                                    connectError: true,
                                    error: `${event.origin} is not an allowed domain`,
                                },
                                event.origin,
                            );

                            return;
                        }

                        const { method } = data;

                        if (!~domain.allowedMethods.indexOf(method) && method !== 'connect') {
                            event.source.postMessage(
                                {
                                    id,
                                    error: `${method} is not an allowed method from ${event.origin}`,
                                },
                                event.origin,
                            );

                            return;
                        }

                        methods[method](event, data);
                    }

                    function close() {
                        window.removeEventListener('message', handleMessage);
                    }

                    window.addEventListener('message', handleMessage);

                    return {
                        close,
                    };
                };
            },
            { '../getId': 7, './methods': 9 },
        ],
        9: [
            function (require, module, exports) {
                const connectId = 'sessionAccessId-connected';

                module.exports = {
                    get(event, data) {
                        event.source.postMessage(
                            {
                                id: data.id,
                                data: window.localStorage.getItem(data.key),
                            },
                            event.origin,
                        );
                    },
                    set(event, data) {
                        window.localStorage.setItem(data.key, data.value);

                        event.source.postMessage(
                            {
                                id: data.id,
                            },
                            event.origin,
                        );
                    },
                    remove(event, data) {
                        window.localStorage.removeItem(data.key);

                        event.source.postMessage(
                            {
                                id: data.id,
                            },
                            event.origin,
                        );
                    },
                    connect(event) {
                        event.source.postMessage(
                            {
                                id: connectId,
                            },
                            event.origin,
                        );
                    },
                };
            },
            {},
        ],
        10: [
            function (require, module, exports) {
                const crel = require('crel');
                const doc = require('doc-js');
                const createStorageHost = require('../../source/host');

                const instructions = crel(
                    'div',
                    {
                        class: 'instructions',
                    },
                    crel('h3', 'cross-domain-storage host'),
                );

                doc.ready(() => {
                    crel(document.body, instructions);

                    window.localStorage.setItem('foo', 'bar');

                    createStorageHost([
                        {
                            origin: /http:\/\/localhost:9124/,
                            allowedMethods: ['get', 'set', 'remove'],
                        },
                    ]);

                    // At some point - storageHost.close()
                });
            },
            { '../../source/host': 8, crel: 1, 'doc-js': 3 },
        ],
    },
    {},
    [10],
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY3JlbC9jcmVsLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9kb2MuanMiLCJub2RlX21vZHVsZXMvZG9jLWpzL2ZsdWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb2MtanMvZ2V0VGFyZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9nZXRUYXJnZXRzLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9pc0xpc3QuanMiLCJzb3VyY2UvZ2V0SWQuanMiLCJzb3VyY2UvaG9zdC9pbmRleC5qcyIsInNvdXJjZS9ob3N0L21ldGhvZHMuanMiLCJ0ZXN0cy9ob3N0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKiBDb3B5cmlnaHQgKEMpIDIwMTIgS29yeSBOdW5uXHJcblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuXHJcbk5PVEU6XHJcblRoaXMgY29kZSBpcyBmb3JtYXR0ZWQgZm9yIHJ1bi1zcGVlZCBhbmQgdG8gYXNzaXN0IGNvbXBpbGVycy5cclxuVGhpcyBtaWdodCBtYWtlIGl0IGhhcmRlciB0byByZWFkIGF0IHRpbWVzLCBidXQgdGhlIGNvZGUncyBpbnRlbnRpb24gc2hvdWxkIGJlIHRyYW5zcGFyZW50LiAqL1xyXG5cclxuLy8gSUlGRSBvdXIgZnVuY3Rpb25cclxuKChleHBvcnRlcikgPT4ge1xyXG4gICAgLy8gRGVmaW5lIG91ciBmdW5jdGlvbiBhbmQgaXRzIHByb3BlcnRpZXNcclxuICAgIC8vIFRoZXNlIHN0cmluZ3MgYXJlIHVzZWQgbXVsdGlwbGUgdGltZXMsIHNvIHRoaXMgbWFrZXMgdGhpbmdzIHNtYWxsZXIgb25jZSBjb21waWxlZFxyXG4gICAgY29uc3QgZnVuYyA9ICdmdW5jdGlvbicsXHJcbiAgICAgICAgaXNOb2RlU3RyaW5nID0gJ2lzTm9kZScsXHJcbiAgICAgICAgLy8gSGVscGVyIGZ1bmN0aW9ucyB1c2VkIHRocm91Z2hvdXQgdGhlIHNjcmlwdFxyXG4gICAgICAgIGlzVHlwZSA9IChvYmplY3QsIHR5cGUpID0+IHR5cGVvZiBvYmplY3QgPT09IHR5cGUsXHJcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgYXBwZW5kcyBjaGlsZHJlbiB0byBnaXZlbiBlbGVtZW50LiBBcyBhIHRleHQgbm9kZSBpZiBub3QgYWxyZWFkeSBhbiBlbGVtZW50XHJcbiAgICAgICAgYXBwZW5kQ2hpbGQgPSAoZWxlbWVudCwgY2hpbGQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGNoaWxkICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHsgLy8gU3VwcG9ydCAoZGVlcGx5KSBuZXN0ZWQgY2hpbGQgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5tYXAoc3ViQ2hpbGQgPT4gYXBwZW5kQ2hpbGQoZWxlbWVudCwgc3ViQ2hpbGQpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjcmVsW2lzTm9kZVN0cmluZ10oY2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAvL1xyXG4gICAgZnVuY3Rpb24gY3JlbCAoZWxlbWVudCwgc2V0dGluZ3MpIHtcclxuICAgICAgICAvLyBEZWZpbmUgYWxsIHVzZWQgdmFyaWFibGVzIC8gc2hvcnRjdXRzIGhlcmUsIHRvIG1ha2UgdGhpbmdzIHNtYWxsZXIgb25jZSBjb21waWxlZFxyXG4gICAgICAgIGxldCBhcmdzID0gYXJndW1lbnRzLCAvLyBOb3RlOiBhc3NpZ25lZCB0byBhIHZhcmlhYmxlIHRvIGFzc2lzdCBjb21waWxlcnMuXHJcbiAgICAgICAgICAgIGluZGV4ID0gMSxcclxuICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGU7XHJcbiAgICAgICAgLy8gSWYgZmlyc3QgYXJndW1lbnQgaXMgYW4gZWxlbWVudCwgdXNlIGl0IGFzIGlzLCBvdGhlcndpc2UgdHJlYXQgaXQgYXMgYSB0YWduYW1lXHJcbiAgICAgICAgZWxlbWVudCA9IGNyZWwuaXNFbGVtZW50KGVsZW1lbnQpID8gZWxlbWVudCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZWxlbWVudCk7XHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgc2Vjb25kIGFyZ3VtZW50IGlzIGEgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICAgICAgaWYgKGlzVHlwZShzZXR0aW5ncywgJ29iamVjdCcpICYmICFjcmVsW2lzTm9kZVN0cmluZ10oc2V0dGluZ3MpICYmICFBcnJheS5pc0FycmF5KHNldHRpbmdzKSkge1xyXG4gICAgICAgICAgICAvLyBEb24ndCB0cmVhdCBzZXR0aW5ncyBhcyBhIGNoaWxkXHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIC8vIEdvIHRocm91Z2ggc2V0dGluZ3MgLyBhdHRyaWJ1dGVzIG9iamVjdCwgaWYgaXQgZXhpc3RzXHJcbiAgICAgICAgICAgIGZvciAoa2V5IGluIHNldHRpbmdzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgYXR0cmlidXRlIGludG8gYSB2YXJpYWJsZSwgYmVmb3JlIHdlIHBvdGVudGlhbGx5IG1vZGlmeSB0aGUga2V5XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSBzZXR0aW5nc1trZXldO1xyXG4gICAgICAgICAgICAgICAgLy8gR2V0IG1hcHBlZCBrZXkgLyBmdW5jdGlvbiwgaWYgb25lIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAga2V5ID0gY3JlbC5hdHRyTWFwW2tleV0gfHwga2V5O1xyXG4gICAgICAgICAgICAgICAgLy8gTm90ZTogV2Ugd2FudCB0byBwcmlvcml0aXNlIG1hcHBpbmcgb3ZlciBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUeXBlKGtleSwgZnVuYykpIHtcclxuICAgICAgICAgICAgICAgICAgICBrZXkoZWxlbWVudCwgYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUeXBlKGF0dHJpYnV0ZSwgZnVuYykpIHsgLy8gZXguIG9uQ2xpY2sgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50W2tleV0gPSBhdHRyaWJ1dGU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgZWxlbWVudCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFsbCBhcmd1bWVudHMsIGlmIGFueSwgYW5kIGFwcGVuZCB0aGVtIHRvIG91ciBlbGVtZW50IGlmIHRoZXkncmUgbm90IGBudWxsYFxyXG4gICAgICAgIGZvciAoOyBpbmRleCA8IGFyZ3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIGFyZ3NbaW5kZXhdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVzZWQgZm9yIG1hcHBpbmcgYXR0cmlidXRlIGtleXMgdG8gc3VwcG9ydGVkIHZlcnNpb25zIGluIGJhZCBicm93c2Vycywgb3IgdG8gY3VzdG9tIGZ1bmN0aW9uYWxpdHlcclxuICAgIGNyZWwuYXR0ck1hcCA9IHt9O1xyXG4gICAgY3JlbC5pc0VsZW1lbnQgPSBvYmplY3QgPT4gb2JqZWN0IGluc3RhbmNlb2YgRWxlbWVudDtcclxuICAgIGNyZWxbaXNOb2RlU3RyaW5nXSA9IG5vZGUgPT4gbm9kZSBpbnN0YW5jZW9mIE5vZGU7XHJcbiAgICAvLyBFeHBvc2UgcHJveHkgaW50ZXJmYWNlXHJcbiAgICBpZiAodHlwZW9mIFByb3h5ICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICBjcmVsLnByb3h5ID0gbmV3IFByb3h5KGNyZWwsIHtcclxuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBrZXkpID0+IHtcclxuICAgICAgICAgICAgICAgICEoa2V5IGluIGNyZWwpICYmIChjcmVsW2tleV0gPSBjcmVsLmJpbmQobnVsbCwga2V5KSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3JlbFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvLyBFeHBvcnQgY3JlbFxyXG4gICAgZXhwb3J0ZXIoY3JlbCwgZnVuYyk7XHJcbn0pKChwcm9kdWN0LCBmdW5jKSA9PiB7XHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgLy8gRXhwb3J0IGZvciBCcm93c2VyaWZ5IC8gQ29tbW9uSlMgZm9ybWF0XHJcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBwcm9kdWN0O1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBmdW5jICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICAvLyBFeHBvcnQgZm9yIFJlcXVpcmVKUyAvIEFNRCBmb3JtYXRcclxuICAgICAgICBkZWZpbmUoKCkgPT4gcHJvZHVjdCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEV4cG9ydCBhcyBhICdnbG9iYWwnIGZ1bmN0aW9uXHJcbiAgICAgICAgdGhpcy5jcmVsID0gcHJvZHVjdDtcclxuICAgIH1cclxufSk7XHJcbiIsInZhciBkb2MgPSB7XHJcbiAgICBkb2N1bWVudDogdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50IDogbnVsbCxcclxuICAgIHNldERvY3VtZW50OiBmdW5jdGlvbihkKXtcclxuICAgICAgICB0aGlzLmRvY3VtZW50ID0gZDtcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBhcnJheVByb3RvID0gW10sXHJcbiAgICBpc0xpc3QgPSByZXF1aXJlKCcuL2lzTGlzdCcpLFxyXG4gICAgZ2V0VGFyZ2V0cyA9IHJlcXVpcmUoJy4vZ2V0VGFyZ2V0cycpKGRvYy5kb2N1bWVudCksXHJcbiAgICBnZXRUYXJnZXQgPSByZXF1aXJlKCcuL2dldFRhcmdldCcpKGRvYy5kb2N1bWVudCksXHJcbiAgICBzcGFjZSA9ICcgJztcclxuXHJcblxyXG4vLy9bUkVBRE1FLm1kXVxyXG5cclxuZnVuY3Rpb24gaXNJbihhcnJheSwgaXRlbSl7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZihpdGVtID09PSBhcnJheVtpXSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmZpbmRcclxuXHJcbiAgICBmaW5kcyBlbGVtZW50cyB0aGF0IG1hdGNoIHRoZSBxdWVyeSB3aXRoaW4gdGhlIHNjb3BlIG9mIHRhcmdldFxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmZpbmQocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5maW5kKHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZmluZCh0YXJnZXQsIHF1ZXJ5KXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuICAgIGlmKHF1ZXJ5ID09IG51bGwpe1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHZhciByZXN1bHRzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIHN1YlJlc3VsdHMgPSBkb2MuZmluZCh0YXJnZXRbaV0sIHF1ZXJ5KTtcclxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHN1YlJlc3VsdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKCFpc0luKHJlc3VsdHMsIHN1YlJlc3VsdHNbal0pKXtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goc3ViUmVzdWx0c1tqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldCA/IHRhcmdldC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSA6IFtdO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuZmluZE9uZVxyXG5cclxuICAgIGZpbmRzIHRoZSBmaXJzdCBlbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGUgcXVlcnkgd2l0aGluIHRoZSBzY29wZSBvZiB0YXJnZXRcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5maW5kT25lKHF1ZXJ5KTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MuZmluZE9uZSh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGZpbmRPbmUodGFyZ2V0LCBxdWVyeSl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KTtcclxuICAgIGlmKHF1ZXJ5ID09IG51bGwpe1xyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gZmluZE9uZSh0YXJnZXRbaV0sIHF1ZXJ5KTtcclxuICAgICAgICAgICAgaWYocmVzdWx0KXtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldCA/IHRhcmdldC5xdWVyeVNlbGVjdG9yKHF1ZXJ5KSA6IG51bGw7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5jbG9zZXN0XHJcblxyXG4gICAgcmVjdXJzZXMgdXAgdGhlIERPTSBmcm9tIHRoZSB0YXJnZXQgbm9kZSwgY2hlY2tpbmcgaWYgdGhlIGN1cnJlbnQgZWxlbWVudCBtYXRjaGVzIHRoZSBxdWVyeVxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmNsb3Nlc3QocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5jbG9zZXN0KHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gY2xvc2VzdCh0YXJnZXQsIHF1ZXJ5KXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbMF07XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUoXHJcbiAgICAgICAgdGFyZ2V0ICYmXHJcbiAgICAgICAgdGFyZ2V0Lm93bmVyRG9jdW1lbnQgJiZcclxuICAgICAgICAhaXModGFyZ2V0LCBxdWVyeSlcclxuICAgICl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldCA9PT0gZG9jLmRvY3VtZW50ICYmIHRhcmdldCAhPT0gcXVlcnkgPyBudWxsIDogdGFyZ2V0O1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuaXNcclxuXHJcbiAgICByZXR1cm5zIHRydWUgaWYgdGhlIHRhcmdldCBlbGVtZW50IG1hdGNoZXMgdGhlIHF1ZXJ5XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuaXMocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5pcyh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGlzKHRhcmdldCwgcXVlcnkpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCk7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFswXTtcclxuICAgIH1cclxuXHJcbiAgICBpZighdGFyZ2V0Lm93bmVyRG9jdW1lbnQgfHwgdHlwZW9mIHF1ZXJ5ICE9PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldCA9PT0gcXVlcnk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodGFyZ2V0ID09PSBxdWVyeSl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcmVudGxlc3MgPSAhdGFyZ2V0LnBhcmVudE5vZGU7XHJcblxyXG4gICAgaWYocGFyZW50bGVzcyl7XHJcbiAgICAgICAgLy8gR2l2ZSB0aGUgZWxlbWVudCBhIHBhcmVudCBzbyB0aGF0IC5xdWVyeVNlbGVjdG9yQWxsIGNhbiBiZSB1c2VkXHJcbiAgICAgICAgZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLmFwcGVuZENoaWxkKHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlc3VsdCA9IGFycmF5UHJvdG8uaW5kZXhPZi5jYWxsKGZpbmQodGFyZ2V0LnBhcmVudE5vZGUsIHF1ZXJ5KSwgdGFyZ2V0KSA+PSAwO1xyXG5cclxuICAgIGlmKHBhcmVudGxlc3Mpe1xyXG4gICAgICAgIHRhcmdldC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmFkZENsYXNzXHJcblxyXG4gICAgYWRkcyBjbGFzc2VzIHRvIHRoZSB0YXJnZXQgKHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb3IgYXJyYXkpXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuYWRkQ2xhc3MocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5hZGRDbGFzcyh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGFkZENsYXNzKHRhcmdldCwgY2xhc3Nlcyl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFkZENsYXNzKHRhcmdldFtpXSwgY2xhc3Nlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgaWYoIWNsYXNzZXMpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjbGFzc2VzID0gQXJyYXkuaXNBcnJheShjbGFzc2VzKSA/IGNsYXNzZXMgOiBjbGFzc2VzLnNwbGl0KHNwYWNlKSxcclxuICAgICAgICBjdXJyZW50Q2xhc3NlcyA9IHRhcmdldC5jbGFzc0xpc3QgPyBudWxsIDogdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdChzcGFjZSk7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBjbGFzc1RvQWRkID0gY2xhc3Nlc1tpXTtcclxuICAgICAgICBpZighY2xhc3NUb0FkZCB8fCBjbGFzc1RvQWRkID09PSBzcGFjZSl7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuY2xhc3NMaXN0KXtcclxuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoY2xhc3NUb0FkZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmKCFjdXJyZW50Q2xhc3Nlcy5pbmRleE9mKGNsYXNzVG9BZGQpPj0wKXtcclxuICAgICAgICAgICAgY3VycmVudENsYXNzZXMucHVzaChjbGFzc1RvQWRkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZighdGFyZ2V0LmNsYXNzTGlzdCl7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTmFtZSA9IGN1cnJlbnRDbGFzc2VzLmpvaW4oc3BhY2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5yZW1vdmVDbGFzc1xyXG5cclxuICAgIHJlbW92ZXMgY2xhc3NlcyBmcm9tIHRoZSB0YXJnZXQgKHNwYWNlIHNlcGFyYXRlZCBzdHJpbmcgb3IgYXJyYXkpXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkucmVtb3ZlQ2xhc3MocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5yZW1vdmVDbGFzcyh0YXJnZXQsIHF1ZXJ5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKHRhcmdldCwgY2xhc3Nlcyl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKHRhcmdldFtpXSwgY2xhc3Nlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCFjbGFzc2VzKXtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2xhc3NlcyA9IEFycmF5LmlzQXJyYXkoY2xhc3NlcykgPyBjbGFzc2VzIDogY2xhc3Nlcy5zcGxpdChzcGFjZSksXHJcbiAgICAgICAgY3VycmVudENsYXNzZXMgPSB0YXJnZXQuY2xhc3NMaXN0ID8gbnVsbCA6IHRhcmdldC5jbGFzc05hbWUuc3BsaXQoc3BhY2UpO1xyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBjbGFzc2VzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgY2xhc3NUb1JlbW92ZSA9IGNsYXNzZXNbaV07XHJcbiAgICAgICAgaWYoIWNsYXNzVG9SZW1vdmUgfHwgY2xhc3NUb1JlbW92ZSA9PT0gc3BhY2Upe1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGFyZ2V0LmNsYXNzTGlzdCl7XHJcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzVG9SZW1vdmUpO1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHJlbW92ZUluZGV4ID0gY3VycmVudENsYXNzZXMuaW5kZXhPZihjbGFzc1RvUmVtb3ZlKTtcclxuICAgICAgICBpZihyZW1vdmVJbmRleCA+PSAwKXtcclxuICAgICAgICAgICAgY3VycmVudENsYXNzZXMuc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZighdGFyZ2V0LmNsYXNzTGlzdCl7XHJcbiAgICAgICAgdGFyZ2V0LmNsYXNzTmFtZSA9IGN1cnJlbnRDbGFzc2VzLmpvaW4oc3BhY2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEV2ZW50KHNldHRpbmdzKXtcclxuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoc2V0dGluZ3MudGFyZ2V0KTtcclxuICAgIGlmKHRhcmdldCl7XHJcbiAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoc2V0dGluZ3MuZXZlbnQsIHNldHRpbmdzLmNhbGxiYWNrLCBmYWxzZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBjb25zb2xlLndhcm4oJ05vIGVsZW1lbnRzIG1hdGNoZWQgdGhlIHNlbGVjdG9yLCBzbyBubyBldmVudHMgd2VyZSBib3VuZC4nKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLm9uXHJcblxyXG4gICAgYmluZHMgYSBjYWxsYmFjayB0byBhIHRhcmdldCB3aGVuIGEgRE9NIGV2ZW50IGlzIHJhaXNlZC5cclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0L3Byb3h5KS5vbihldmVudHMsIHRhcmdldFtvcHRpb25hbF0sIGNhbGxiYWNrKTtcclxuXHJcbiAgICBub3RlOiBpZiBhIHRhcmdldCBpcyBwYXNzZWQgdG8gdGhlIC5vbiBmdW5jdGlvbiwgZG9jJ3MgdGFyZ2V0IHdpbGwgYmUgdXNlZCBhcyB0aGUgcHJveHkuXHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLm9uKGV2ZW50cywgdGFyZ2V0LCBxdWVyeSwgcHJveHlbb3B0aW9uYWxdKTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9uKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHkpe1xyXG5cclxuICAgIHByb3h5ID0gZ2V0VGFyZ2V0cyhwcm94eSk7XHJcblxyXG4gICAgaWYoIXByb3h5KXtcclxuICAgICAgICB0YXJnZXQgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcbiAgICAgICAgLy8gaGFuZGxlcyBtdWx0aXBsZSB0YXJnZXRzXHJcbiAgICAgICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgICAgICB2YXIgbXVsdGlSZW1vdmVDYWxsYmFja3MgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG11bHRpUmVtb3ZlQ2FsbGJhY2tzLnB1c2gob24oZXZlbnRzLCB0YXJnZXRbaV0sIGNhbGxiYWNrLCBwcm94eSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgd2hpbGUobXVsdGlSZW1vdmVDYWxsYmFja3MubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aVJlbW92ZUNhbGxiYWNrcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGFuZGxlcyBtdWx0aXBsZSBwcm94aWVzXHJcbiAgICAvLyBBbHJlYWR5IGhhbmRsZXMgbXVsdGlwbGUgcHJveGllcyBhbmQgdGFyZ2V0cyxcclxuICAgIC8vIGJlY2F1c2UgdGhlIHRhcmdldCBsb29wIGNhbGxzIHRoaXMgbG9vcC5cclxuICAgIGlmKGlzTGlzdChwcm94eSkpe1xyXG4gICAgICAgIHZhciBtdWx0aVJlbW92ZUNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJveHkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbXVsdGlSZW1vdmVDYWxsYmFja3MucHVzaChvbihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5W2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB3aGlsZShtdWx0aVJlbW92ZUNhbGxiYWNrcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgbXVsdGlSZW1vdmVDYWxsYmFja3MucG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHZhciByZW1vdmVDYWxsYmFja3MgPSBbXTtcclxuXHJcbiAgICBpZih0eXBlb2YgZXZlbnRzID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgZXZlbnRzID0gZXZlbnRzLnNwbGl0KHNwYWNlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICB2YXIgZXZlbnRTZXR0aW5ncyA9IHt9O1xyXG4gICAgICAgIGlmKHByb3h5KXtcclxuICAgICAgICAgICAgaWYocHJveHkgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgcHJveHkgPSBkb2MuZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXZlbnRTZXR0aW5ncy50YXJnZXQgPSBwcm94eTtcclxuICAgICAgICAgICAgZXZlbnRTZXR0aW5ncy5jYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgIHZhciBjbG9zZXN0VGFyZ2V0ID0gY2xvc2VzdChldmVudC50YXJnZXQsIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBpZihjbG9zZXN0VGFyZ2V0KXtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCwgY2xvc2VzdFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGV2ZW50U2V0dGluZ3MudGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICBldmVudFNldHRpbmdzLmNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBldmVudFNldHRpbmdzLmV2ZW50ID0gZXZlbnRzW2ldO1xyXG5cclxuICAgICAgICBhZGRFdmVudChldmVudFNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgcmVtb3ZlQ2FsbGJhY2tzLnB1c2goZXZlbnRTZXR0aW5ncyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgd2hpbGUocmVtb3ZlQ2FsbGJhY2tzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHZhciByZW1vdmVDYWxsYmFjayA9IHJlbW92ZUNhbGxiYWNrcy5wb3AoKTtcclxuICAgICAgICAgICAgZ2V0VGFyZ2V0KHJlbW92ZUNhbGxiYWNrLnRhcmdldCkucmVtb3ZlRXZlbnRMaXN0ZW5lcihyZW1vdmVDYWxsYmFjay5ldmVudCwgcmVtb3ZlQ2FsbGJhY2suY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLm9mZlxyXG5cclxuICAgIHJlbW92ZXMgZXZlbnRzIGFzc2lnbmVkIHRvIGEgdGFyZ2V0LlxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQvcHJveHkpLm9mZihldmVudHMsIHRhcmdldFtvcHRpb25hbF0sIGNhbGxiYWNrKTtcclxuXHJcbiAgICBub3RlOiBpZiBhIHRhcmdldCBpcyBwYXNzZWQgdG8gdGhlIC5vbiBmdW5jdGlvbiwgZG9jJ3MgdGFyZ2V0IHdpbGwgYmUgdXNlZCBhcyB0aGUgcHJveHkuXHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLm9mZihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIG9mZihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5KXtcclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvZmYoZXZlbnRzLCB0YXJnZXRbaV0sIGNhbGxiYWNrLCBwcm94eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgaWYocHJveHkgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm94eS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvZmYoZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHR5cGVvZiBldmVudHMgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBldmVudHMgPSBldmVudHMuc3BsaXQoc3BhY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgcHJveHkgPSBjYWxsYmFjaztcclxuICAgICAgICBjYWxsYmFjayA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJveHkgPSBwcm94eSA/IGdldFRhcmdldChwcm94eSkgOiBkb2MuZG9jdW1lbnQ7XHJcblxyXG4gICAgdmFyIHRhcmdldHMgPSB0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyA/IGZpbmQodGFyZ2V0LCBwcm94eSkgOiBbdGFyZ2V0XTtcclxuXHJcbiAgICBmb3IodmFyIHRhcmdldEluZGV4ID0gMDsgdGFyZ2V0SW5kZXggPCB0YXJnZXRzLmxlbmd0aDsgdGFyZ2V0SW5kZXgrKyl7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRUYXJnZXQgPSB0YXJnZXRzW3RhcmdldEluZGV4XTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGV2ZW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIGN1cnJlbnRUYXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbaV0sIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmFwcGVuZFxyXG5cclxuICAgIGFkZHMgZWxlbWVudHMgdG8gYSB0YXJnZXRcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5hcHBlbmQoY2hpbGRyZW4pO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5hcHBlbmQodGFyZ2V0LCBjaGlsZHJlbik7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBhcHBlbmQodGFyZ2V0LCBjaGlsZHJlbil7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCksXHJcbiAgICAgICAgY2hpbGRyZW4gPSBnZXRUYXJnZXQoY2hpbGRyZW4pO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaXNMaXN0KGNoaWxkcmVuKSl7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhcHBlbmQodGFyZ2V0LCBjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAucHJlcGVuZFxyXG5cclxuICAgIGFkZHMgZWxlbWVudHMgdG8gdGhlIGZyb250IG9mIGEgdGFyZ2V0XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkucHJlcGVuZChjaGlsZHJlbik7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLnByZXBlbmQodGFyZ2V0LCBjaGlsZHJlbik7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBwcmVwZW5kKHRhcmdldCwgY2hpbGRyZW4pe1xyXG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpLFxyXG4gICAgICAgIGNoaWxkcmVuID0gZ2V0VGFyZ2V0KGNoaWxkcmVuKTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGlzTGlzdChjaGlsZHJlbikpe1xyXG4gICAgICAgIC8vcmV2ZXJzZWQgYmVjYXVzZSBvdGhlcndpc2UgdGhlIHdvdWxkIGdldCBwdXQgaW4gaW4gdGhlIHdyb25nIG9yZGVyLlxyXG4gICAgICAgIGZvciAodmFyIGkgPSBjaGlsZHJlbi5sZW5ndGggLTE7IGk7IGktLSkge1xyXG4gICAgICAgICAgICBwcmVwZW5kKHRhcmdldCwgY2hpbGRyZW5baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGFyZ2V0Lmluc2VydEJlZm9yZShjaGlsZHJlbiwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuaXNWaXNpYmxlXHJcblxyXG4gICAgY2hlY2tzIGlmIGFuIGVsZW1lbnQgb3IgYW55IG9mIGl0cyBwYXJlbnRzIGRpc3BsYXkgcHJvcGVydGllcyBhcmUgc2V0IHRvICdub25lJ1xyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmlzVmlzaWJsZSgpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5pc1Zpc2libGUodGFyZ2V0KTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGlzVmlzaWJsZSh0YXJnZXQpe1xyXG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpO1xyXG4gICAgaWYoIXRhcmdldCl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHZhciBpID0gLTE7XHJcblxyXG4gICAgICAgIHdoaWxlICh0YXJnZXRbaSsrXSAmJiBpc1Zpc2libGUodGFyZ2V0W2ldKSkge31cclxuICAgICAgICByZXR1cm4gdGFyZ2V0Lmxlbmd0aCA+PSBpO1xyXG4gICAgfVxyXG4gICAgd2hpbGUodGFyZ2V0LnBhcmVudE5vZGUgJiYgdGFyZ2V0LnN0eWxlLmRpc3BsYXkgIT09ICdub25lJyl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldCA9PT0gZG9jLmRvY3VtZW50O1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuaW5kZXhPZkVsZW1lbnRcclxuXHJcbiAgICByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCB3aXRoaW4gaXQncyBwYXJlbnQgZWxlbWVudC5cclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5pbmRleE9mRWxlbWVudCgpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5pbmRleE9mRWxlbWVudCh0YXJnZXQpO1xyXG5cclxuKi9cclxuXHJcbmZ1bmN0aW9uIGluZGV4T2ZFbGVtZW50KHRhcmdldCkge1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG4gICAgaWYoIXRhcmdldCl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbMF07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGkgPSAtMTtcclxuXHJcbiAgICB2YXIgcGFyZW50ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgaWYoIXBhcmVudCl7XHJcbiAgICAgICAgcmV0dXJuIGk7XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUocGFyZW50LmNoaWxkcmVuWysraV0gIT09IHRhcmdldCl7fVxyXG5cclxuICAgIHJldHVybiBpO1xyXG59XHJcblxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLnJlYWR5XHJcblxyXG4gICAgY2FsbCBhIGNhbGxiYWNrIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5LlxyXG5cclxuICAgIHJldHVybnMgLTEgaWYgdGhlcmUgaXMgbm8gcGFyZW50RWxlbWVudCBvbiB0aGUgdGFyZ2V0LlxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYygpLnJlYWR5KGNhbGxiYWNrKTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MucmVhZHkoY2FsbGJhY2spO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gcmVhZHkoY2FsbGJhY2spe1xyXG4gICAgaWYoZG9jLmRvY3VtZW50ICYmIChkb2MuZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyB8fCBkb2MuZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2ludGVyYWN0aXZlJykpe1xyXG4gICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9ZWxzZSBpZih3aW5kb3cuYXR0YWNoRXZlbnQpe1xyXG4gICAgICAgIGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsIGNhbGxiYWNrKTtcclxuICAgICAgICB3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbkxvYWRcIixjYWxsYmFjayk7XHJcbiAgICB9ZWxzZSBpZihkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKXtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLGNhbGxiYWNrLGZhbHNlKTtcclxuICAgIH1cclxufVxyXG5cclxuZG9jLmZpbmQgPSBmaW5kO1xyXG5kb2MuZmluZE9uZSA9IGZpbmRPbmU7XHJcbmRvYy5jbG9zZXN0ID0gY2xvc2VzdDtcclxuZG9jLmlzID0gaXM7XHJcbmRvYy5hZGRDbGFzcyA9IGFkZENsYXNzO1xyXG5kb2MucmVtb3ZlQ2xhc3MgPSByZW1vdmVDbGFzcztcclxuZG9jLm9mZiA9IG9mZjtcclxuZG9jLm9uID0gb247XHJcbmRvYy5hcHBlbmQgPSBhcHBlbmQ7XHJcbmRvYy5wcmVwZW5kID0gcHJlcGVuZDtcclxuZG9jLmlzVmlzaWJsZSA9IGlzVmlzaWJsZTtcclxuZG9jLnJlYWR5ID0gcmVhZHk7XHJcbmRvYy5pbmRleE9mRWxlbWVudCA9IGluZGV4T2ZFbGVtZW50O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2M7IiwidmFyIGRvYyA9IHJlcXVpcmUoJy4vZG9jJyksXHJcbiAgICBpc0xpc3QgPSByZXF1aXJlKCcuL2lzTGlzdCcpLFxyXG4gICAgZ2V0VGFyZ2V0cyA9IHJlcXVpcmUoJy4vZ2V0VGFyZ2V0cycpKGRvYy5kb2N1bWVudCksXHJcbiAgICBmbG9jUHJvdG8gPSBbXTtcclxuXHJcbmZ1bmN0aW9uIEZsb2MoaXRlbXMpe1xyXG4gICAgdGhpcy5wdXNoLmFwcGx5KHRoaXMsIGl0ZW1zKTtcclxufVxyXG5GbG9jLnByb3RvdHlwZSA9IGZsb2NQcm90bztcclxuZmxvY1Byb3RvLmNvbnN0cnVjdG9yID0gRmxvYztcclxuXHJcbmZ1bmN0aW9uIGZsb2ModGFyZ2V0KXtcclxuICAgIHZhciBpbnN0YW5jZSA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuXHJcbiAgICBpZighaXNMaXN0KGluc3RhbmNlKSl7XHJcbiAgICAgICAgaWYoaW5zdGFuY2Upe1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IFtpbnN0YW5jZV07XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGbG9jKGluc3RhbmNlKTtcclxufVxyXG5cclxudmFyIHJldHVybnNTZWxmID0gJ2FkZENsYXNzIHJlbW92ZUNsYXNzIGFwcGVuZCBwcmVwZW5kJy5zcGxpdCgnICcpO1xyXG5cclxuZm9yKHZhciBrZXkgaW4gZG9jKXtcclxuICAgIGlmKHR5cGVvZiBkb2Nba2V5XSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgZmxvY1trZXldID0gZG9jW2tleV07XHJcbiAgICAgICAgZmxvY1Byb3RvW2tleV0gPSAoZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gdGhpcztcclxuICAgICAgICAgICAgLy8gVGhpcyBpcyBhbHNvIGV4dHJlbWVseSBkb2RneSBhbmQgZmFzdFxyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oYSxiLGMsZCxlLGYpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGRvY1trZXldKHRoaXMsIGEsYixjLGQsZSxmKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihyZXN1bHQgIT09IGRvYyAmJiBpc0xpc3QocmVzdWx0KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZsb2MocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKHJldHVybnNTZWxmLmluZGV4T2Yoa2V5KSA+PTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfShrZXkpKTtcclxuICAgIH1cclxufVxyXG5mbG9jUHJvdG8ub24gPSBmdW5jdGlvbihldmVudHMsIHRhcmdldCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIHByb3h5ID0gdGhpcztcclxuICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdmdW5jdGlvbicpe1xyXG4gICAgICAgIGNhbGxiYWNrID0gdGFyZ2V0O1xyXG4gICAgICAgIHRhcmdldCA9IHRoaXM7XHJcbiAgICAgICAgcHJveHkgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgZG9jLm9uKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHkpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5mbG9jUHJvdG8ub2ZmID0gZnVuY3Rpb24oZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrKXtcclxuICAgIHZhciByZWZlcmVuY2UgPSB0aGlzO1xyXG4gICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgY2FsbGJhY2sgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICByZWZlcmVuY2UgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgZG9jLm9mZihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHJlZmVyZW5jZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbmZsb2NQcm90by5yZWFkeSA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgIGRvYy5yZWFkeShjYWxsYmFjayk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbmZsb2NQcm90by5hZGRDbGFzcyA9IGZ1bmN0aW9uKGNsYXNzTmFtZSl7XHJcbiAgICBkb2MuYWRkQ2xhc3ModGhpcywgY2xhc3NOYW1lKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuZmxvY1Byb3RvLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKXtcclxuICAgIGRvYy5yZW1vdmVDbGFzcyh0aGlzLCBjbGFzc05hbWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZsb2M7IiwidmFyIHNpbmdsZUlkID0gL14jXFx3KyQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvY3VtZW50KXtcbiAgICByZXR1cm4gZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCl7XG4gICAgICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgIGlmKHNpbmdsZUlkLmV4ZWModGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldC5zbGljZSgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufTsiLCJcbnZhciBzaW5nbGVDbGFzcyA9IC9eXFwuXFx3KyQvLFxuICAgIHNpbmdsZUlkID0gL14jXFx3KyQvLFxuICAgIHNpbmdsZVRhZyA9IC9eXFx3KyQvO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvY3VtZW50KXtcbiAgICByZXR1cm4gZnVuY3Rpb24gZ2V0VGFyZ2V0cyh0YXJnZXQpe1xuICAgICAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBpZihzaW5nbGVJZC5leGVjKHRhcmdldCkpe1xuICAgICAgICAgICAgICAgIC8vIElmIHlvdSBoYXZlIG1vcmUgdGhhbiAxIG9mIHRoZSBzYW1lIGlkIGluIHlvdXIgcGFnZSxcbiAgICAgICAgICAgICAgICAvLyB0aGF0cyB5b3VyIG93biBzdHVwaWQgZmF1bHQuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YXJnZXQuc2xpY2UoMSkpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHNpbmdsZVRhZy5leGVjKHRhcmdldCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc2luZ2xlQ2xhc3MuZXhlYyh0YXJnZXQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0YXJnZXQuc2xpY2UoMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGFyZ2V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0xpc3Qob2JqZWN0KXtcclxuICAgIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiB0eXBlb2Ygb2JqZWN0ID09PSAnb2JqZWN0JyAmJiAnbGVuZ3RoJyBpbiBvYmplY3QgJiYgISgnbm9kZVR5cGUnIGluIG9iamVjdCkgJiYgb2JqZWN0LnNlbGYgIT0gb2JqZWN0OyAvLyBpbiBJRTgsIHdpbmRvdy5zZWxmIGlzIHdpbmRvdywgYnV0IGl0IGlzIG5vdCA9PT0gd2luZG93LCBidXQgaXQgaXMgPT0gd2luZG93Li4uLi4uLi4uIFdURiE/XHJcbn0iLCJjb25zdCBwcmVmaXggPSAnc2Vzc2lvbkFjY2Vzc0lkLSc7XG5cbmZ1bmN0aW9uIGdldElkKGRhdGEpIHtcbiAgICBsZXQgaWQ7XG5cbiAgICBpZiAoZGF0YSAmJiBkYXRhLmlkICYmIH5kYXRhLmlkLmluZGV4T2YocHJlZml4KSkge1xuICAgICAgICBpZCA9IGRhdGEuaWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldElkO1xuIiwiY29uc3QgZ2V0SWQgPSByZXF1aXJlKCcuLi9nZXRJZCcpO1xuY29uc3QgbWV0aG9kcyA9IHJlcXVpcmUoJy4vbWV0aG9kcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0b3JhZ2VIb3N0KGFsbG93ZWREb21haW5zKSB7XG4gICAgZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShldmVudCkge1xuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IGV2ZW50O1xuICAgICAgICBjb25zdCBvcmlnaW4gPSBldmVudC5vcmlnaW4gfHwgJyc7XG5cbiAgICAgICAgY29uc3QgZG9tYWluID0gYWxsb3dlZERvbWFpbnMuZmluZChcbiAgICAgICAgICAgIChhbGxvd2VkRG9tYWluKSA9PiBvcmlnaW4gPT09IGFsbG93ZWREb21haW4ub3JpZ2luIHx8IG9yaWdpbi5tYXRjaChhbGxvd2VkRG9tYWluLm9yaWdpbiksXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaWQgPSBnZXRJZChkYXRhKTtcblxuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRvbWFpbikge1xuICAgICAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RFcnJvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGAke2V2ZW50Lm9yaWdpbn0gaXMgbm90IGFuIGFsbG93ZWQgZG9tYWluYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50Lm9yaWdpbixcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWV0aG9kIH0gPSBkYXRhO1xuXG4gICAgICAgIGlmICghfmRvbWFpbi5hbGxvd2VkTWV0aG9kcy5pbmRleE9mKG1ldGhvZCkgJiYgbWV0aG9kICE9PSAnY29ubmVjdCcpIHtcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYCR7bWV0aG9kfSBpcyBub3QgYW4gYWxsb3dlZCBtZXRob2QgZnJvbSAke2V2ZW50Lm9yaWdpbn1gLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0aG9kc1ttZXRob2RdKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGhhbmRsZU1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2xvc2UsXG4gICAgfTtcbn07XG4iLCJjb25zdCBjb25uZWN0SWQgPSAnc2Vzc2lvbkFjY2Vzc0lkLWNvbm5lY3RlZCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGdldChldmVudCwgZGF0YSkge1xuICAgICAgICBldmVudC5zb3VyY2UucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgZGF0YTogd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGRhdGEua2V5KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudC5vcmlnaW4sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBzZXQoZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGRhdGEua2V5LCBkYXRhLnZhbHVlKTtcblxuICAgICAgICBldmVudC5zb3VyY2UucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnQub3JpZ2luLFxuICAgICAgICApO1xuICAgIH0sXG4gICAgcmVtb3ZlKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShkYXRhLmtleSk7XG5cbiAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiBkYXRhLmlkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbixcbiAgICAgICAgKTtcbiAgICB9LFxuICAgIGNvbm5lY3QoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOiBjb25uZWN0SWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXZlbnQub3JpZ2luLFxuICAgICAgICApO1xuICAgIH0sXG59O1xuIiwiY29uc3QgY3JlbCA9IHJlcXVpcmUoJ2NyZWwnKTtcbmNvbnN0IGRvYyA9IHJlcXVpcmUoJ2RvYy1qcycpO1xuY29uc3QgY3JlYXRlU3RvcmFnZUhvc3QgPSByZXF1aXJlKCcuLi8uLi9zb3VyY2UvaG9zdCcpO1xuXG5jb25zdCBpbnN0cnVjdGlvbnMgPSBjcmVsKFxuICAgICdkaXYnLFxuICAgIHtcbiAgICAgICAgY2xhc3M6ICdpbnN0cnVjdGlvbnMnLFxuICAgIH0sXG4gICAgY3JlbCgnaDMnLCAnY3Jvc3MtZG9tYWluLXN0b3JhZ2UgaG9zdCcpLFxuKTtcblxuZG9jLnJlYWR5KCgpID0+IHtcbiAgICBjcmVsKGRvY3VtZW50LmJvZHksIGluc3RydWN0aW9ucyk7XG5cbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ZvbycsICdiYXInKTtcblxuICAgIGNyZWF0ZVN0b3JhZ2VIb3N0KFtcbiAgICAgICAge1xuICAgICAgICAgICAgb3JpZ2luOiAvaHR0cDpcXC9cXC9sb2NhbGhvc3Q6OTEyNC8sXG4gICAgICAgICAgICBhbGxvd2VkTWV0aG9kczogWydnZXQnLCAnc2V0JywgJ3JlbW92ZSddLFxuICAgICAgICB9LFxuICAgIF0pO1xuXG4gICAgLy8gQXQgc29tZSBwb2ludCAtIHN0b3JhZ2VIb3N0LmNsb3NlKClcbn0pO1xuIl19
