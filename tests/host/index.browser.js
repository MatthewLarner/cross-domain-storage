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
                        const domain = allowedDomains.find((allowedDomain) => event.origin === allowedDomain.origin);
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
                const LOCAL_STORAGE = 'localStorage';
                const SESSION_STORAGE = 'sessionStorage';

                module.exports = {
                    get(event, data, storageType = LOCAL_STORAGE) {
                        event.source.postMessage(
                            {
                                id: data.id,
                                data: window[storageType].getItem(data.key),
                            },
                            event.origin,
                        );
                    },
                    set(event, data, storageType = LOCAL_STORAGE) {
                        window[storageType].setItem(data.key, data.value);

                        event.source.postMessage(
                            {
                                id: data.id,
                            },
                            event.origin,
                        );
                    },
                    remove(event, data, storageType = LOCAL_STORAGE) {
                        window[storageType].removeItem(data.key);

                        event.source.postMessage(
                            {
                                id: data.id,
                            },
                            event.origin,
                        );
                    },
                    getSession(event, data) {
                        this.get(event, data, SESSION_STORAGE);
                    },
                    setSession(event, data) {
                        this.set(event, data, SESSION_STORAGE);
                    },
                    removeSession(event, data) {
                        this.remove(event, data, SESSION_STORAGE);
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
                    window.sessionStorage.setItem('foo', 'session bar');

                    createStorageHost([
                        {
                            origin: 'http://localhost:9124',
                            allowedMethods: ['get', 'set', 'remove', 'getSession', 'setSession', 'removeSession'],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY3JlbC9jcmVsLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9kb2MuanMiLCJub2RlX21vZHVsZXMvZG9jLWpzL2ZsdWVudC5qcyIsIm5vZGVfbW9kdWxlcy9kb2MtanMvZ2V0VGFyZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9nZXRUYXJnZXRzLmpzIiwibm9kZV9tb2R1bGVzL2RvYy1qcy9pc0xpc3QuanMiLCJzb3VyY2UvZ2V0SWQuanMiLCJzb3VyY2UvaG9zdC9pbmRleC5qcyIsInNvdXJjZS9ob3N0L21ldGhvZHMuanMiLCJ0ZXN0cy9ob3N0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6a0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qIENvcHlyaWdodCAoQykgMjAxMiBLb3J5IE51bm5cclxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcclxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxyXG5cclxuTk9URTpcclxuVGhpcyBjb2RlIGlzIGZvcm1hdHRlZCBmb3IgcnVuLXNwZWVkIGFuZCB0byBhc3Npc3QgY29tcGlsZXJzLlxyXG5UaGlzIG1pZ2h0IG1ha2UgaXQgaGFyZGVyIHRvIHJlYWQgYXQgdGltZXMsIGJ1dCB0aGUgY29kZSdzIGludGVudGlvbiBzaG91bGQgYmUgdHJhbnNwYXJlbnQuICovXHJcblxyXG4vLyBJSUZFIG91ciBmdW5jdGlvblxyXG4oKGV4cG9ydGVyKSA9PiB7XHJcbiAgICAvLyBEZWZpbmUgb3VyIGZ1bmN0aW9uIGFuZCBpdHMgcHJvcGVydGllc1xyXG4gICAgLy8gVGhlc2Ugc3RyaW5ncyBhcmUgdXNlZCBtdWx0aXBsZSB0aW1lcywgc28gdGhpcyBtYWtlcyB0aGluZ3Mgc21hbGxlciBvbmNlIGNvbXBpbGVkXHJcbiAgICBjb25zdCBmdW5jID0gJ2Z1bmN0aW9uJyxcclxuICAgICAgICBpc05vZGVTdHJpbmcgPSAnaXNOb2RlJyxcclxuICAgICAgICAvLyBIZWxwZXIgZnVuY3Rpb25zIHVzZWQgdGhyb3VnaG91dCB0aGUgc2NyaXB0XHJcbiAgICAgICAgaXNUeXBlID0gKG9iamVjdCwgdHlwZSkgPT4gdHlwZW9mIG9iamVjdCA9PT0gdHlwZSxcclxuICAgICAgICAvLyBSZWN1cnNpdmVseSBhcHBlbmRzIGNoaWxkcmVuIHRvIGdpdmVuIGVsZW1lbnQuIEFzIGEgdGV4dCBub2RlIGlmIG5vdCBhbHJlYWR5IGFuIGVsZW1lbnRcclxuICAgICAgICBhcHBlbmRDaGlsZCA9IChlbGVtZW50LCBjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoY2hpbGQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkgeyAvLyBTdXBwb3J0IChkZWVwbHkpIG5lc3RlZCBjaGlsZCBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLm1hcChzdWJDaGlsZCA9PiBhcHBlbmRDaGlsZChlbGVtZW50LCBzdWJDaGlsZCkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNyZWxbaXNOb2RlU3RyaW5nXShjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIC8vXHJcbiAgICBmdW5jdGlvbiBjcmVsIChlbGVtZW50LCBzZXR0aW5ncykge1xyXG4gICAgICAgIC8vIERlZmluZSBhbGwgdXNlZCB2YXJpYWJsZXMgLyBzaG9ydGN1dHMgaGVyZSwgdG8gbWFrZSB0aGluZ3Mgc21hbGxlciBvbmNlIGNvbXBpbGVkXHJcbiAgICAgICAgbGV0IGFyZ3MgPSBhcmd1bWVudHMsIC8vIE5vdGU6IGFzc2lnbmVkIHRvIGEgdmFyaWFibGUgdG8gYXNzaXN0IGNvbXBpbGVycy5cclxuICAgICAgICAgICAgaW5kZXggPSAxLFxyXG4gICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgIGF0dHJpYnV0ZTtcclxuICAgICAgICAvLyBJZiBmaXJzdCBhcmd1bWVudCBpcyBhbiBlbGVtZW50LCB1c2UgaXQgYXMgaXMsIG90aGVyd2lzZSB0cmVhdCBpdCBhcyBhIHRhZ25hbWVcclxuICAgICAgICBlbGVtZW50ID0gY3JlbC5pc0VsZW1lbnQoZWxlbWVudCkgPyBlbGVtZW50IDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50KTtcclxuICAgICAgICAvLyBDaGVjayBpZiBzZWNvbmQgYXJndW1lbnQgaXMgYSBzZXR0aW5ncyBvYmplY3RcclxuICAgICAgICBpZiAoaXNUeXBlKHNldHRpbmdzLCAnb2JqZWN0JykgJiYgIWNyZWxbaXNOb2RlU3RyaW5nXShzZXR0aW5ncykgJiYgIUFycmF5LmlzQXJyYXkoc2V0dGluZ3MpKSB7XHJcbiAgICAgICAgICAgIC8vIERvbid0IHRyZWF0IHNldHRpbmdzIGFzIGEgY2hpbGRcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgLy8gR28gdGhyb3VnaCBzZXR0aW5ncyAvIGF0dHJpYnV0ZXMgb2JqZWN0LCBpZiBpdCBleGlzdHNcclxuICAgICAgICAgICAgZm9yIChrZXkgaW4gc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBhdHRyaWJ1dGUgaW50byBhIHZhcmlhYmxlLCBiZWZvcmUgd2UgcG90ZW50aWFsbHkgbW9kaWZ5IHRoZSBrZXlcclxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IHNldHRpbmdzW2tleV07XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgbWFwcGVkIGtleSAvIGZ1bmN0aW9uLCBpZiBvbmUgZXhpc3RzXHJcbiAgICAgICAgICAgICAgICBrZXkgPSBjcmVsLmF0dHJNYXBba2V5XSB8fCBrZXk7XHJcbiAgICAgICAgICAgICAgICAvLyBOb3RlOiBXZSB3YW50IHRvIHByaW9yaXRpc2UgbWFwcGluZyBvdmVyIHByb3BlcnRpZXNcclxuICAgICAgICAgICAgICAgIGlmIChpc1R5cGUoa2V5LCBmdW5jKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGtleShlbGVtZW50LCBhdHRyaWJ1dGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1R5cGUoYXR0cmlidXRlLCBmdW5jKSkgeyAvLyBleC4gb25DbGljayBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRba2V5XSA9IGF0dHJpYnV0ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBlbGVtZW50IGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggYWxsIGFyZ3VtZW50cywgaWYgYW55LCBhbmQgYXBwZW5kIHRoZW0gdG8gb3VyIGVsZW1lbnQgaWYgdGhleSdyZSBub3QgYG51bGxgXHJcbiAgICAgICAgZm9yICg7IGluZGV4IDwgYXJncy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgYXBwZW5kQ2hpbGQoZWxlbWVudCwgYXJnc1tpbmRleF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXNlZCBmb3IgbWFwcGluZyBhdHRyaWJ1dGUga2V5cyB0byBzdXBwb3J0ZWQgdmVyc2lvbnMgaW4gYmFkIGJyb3dzZXJzLCBvciB0byBjdXN0b20gZnVuY3Rpb25hbGl0eVxyXG4gICAgY3JlbC5hdHRyTWFwID0ge307XHJcbiAgICBjcmVsLmlzRWxlbWVudCA9IG9iamVjdCA9PiBvYmplY3QgaW5zdGFuY2VvZiBFbGVtZW50O1xyXG4gICAgY3JlbFtpc05vZGVTdHJpbmddID0gbm9kZSA9PiBub2RlIGluc3RhbmNlb2YgTm9kZTtcclxuICAgIC8vIEV4cG9zZSBwcm94eSBpbnRlcmZhY2VcclxuICAgIGlmICh0eXBlb2YgUHJveHkgIT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGNyZWwucHJveHkgPSBuZXcgUHJveHkoY3JlbCwge1xyXG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgIShrZXkgaW4gY3JlbCkgJiYgKGNyZWxba2V5XSA9IGNyZWwuYmluZChudWxsLCBrZXkpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVsW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIEV4cG9ydCBjcmVsXHJcbiAgICBleHBvcnRlcihjcmVsLCBmdW5jKTtcclxufSkoKHByb2R1Y3QsIGZ1bmMpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAvLyBFeHBvcnQgZm9yIEJyb3dzZXJpZnkgLyBDb21tb25KUyBmb3JtYXRcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHByb2R1Y3Q7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IGZ1bmMgJiYgZGVmaW5lLmFtZCkge1xyXG4gICAgICAgIC8vIEV4cG9ydCBmb3IgUmVxdWlyZUpTIC8gQU1EIGZvcm1hdFxyXG4gICAgICAgIGRlZmluZSgoKSA9PiBwcm9kdWN0KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRXhwb3J0IGFzIGEgJ2dsb2JhbCcgZnVuY3Rpb25cclxuICAgICAgICB0aGlzLmNyZWwgPSBwcm9kdWN0O1xyXG4gICAgfVxyXG59KTtcclxuIiwidmFyIGRvYyA9IHtcclxuICAgIGRvY3VtZW50OiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQgOiBudWxsLFxyXG4gICAgc2V0RG9jdW1lbnQ6IGZ1bmN0aW9uKGQpe1xyXG4gICAgICAgIHRoaXMuZG9jdW1lbnQgPSBkO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGFycmF5UHJvdG8gPSBbXSxcclxuICAgIGlzTGlzdCA9IHJlcXVpcmUoJy4vaXNMaXN0JyksXHJcbiAgICBnZXRUYXJnZXRzID0gcmVxdWlyZSgnLi9nZXRUYXJnZXRzJykoZG9jLmRvY3VtZW50KSxcclxuICAgIGdldFRhcmdldCA9IHJlcXVpcmUoJy4vZ2V0VGFyZ2V0JykoZG9jLmRvY3VtZW50KSxcclxuICAgIHNwYWNlID0gJyAnO1xyXG5cclxuXHJcbi8vL1tSRUFETUUubWRdXHJcblxyXG5mdW5jdGlvbiBpc0luKGFycmF5LCBpdGVtKXtcclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmKGl0ZW0gPT09IGFycmF5W2ldKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuZmluZFxyXG5cclxuICAgIGZpbmRzIGVsZW1lbnRzIHRoYXQgbWF0Y2ggdGhlIHF1ZXJ5IHdpdGhpbiB0aGUgc2NvcGUgb2YgdGFyZ2V0XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuZmluZChxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmZpbmQodGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBmaW5kKHRhcmdldCwgcXVlcnkpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG4gICAgaWYocXVlcnkgPT0gbnVsbCl7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgc3ViUmVzdWx0cyA9IGRvYy5maW5kKHRhcmdldFtpXSwgcXVlcnkpO1xyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgc3ViUmVzdWx0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYoIWlzSW4ocmVzdWx0cywgc3ViUmVzdWx0c1tqXSkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChzdWJSZXN1bHRzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0ID8gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpIDogW107XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5maW5kT25lXHJcblxyXG4gICAgZmluZHMgdGhlIGZpcnN0IGVsZW1lbnQgdGhhdCBtYXRjaGVzIHRoZSBxdWVyeSB3aXRoaW4gdGhlIHNjb3BlIG9mIHRhcmdldFxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmZpbmRPbmUocXVlcnkpO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5maW5kT25lKHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gZmluZE9uZSh0YXJnZXQsIHF1ZXJ5KXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldCh0YXJnZXQpO1xyXG4gICAgaWYocXVlcnkgPT0gbnVsbCl7XHJcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdmFyIHJlc3VsdDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBmaW5kT25lKHRhcmdldFtpXSwgcXVlcnkpO1xyXG4gICAgICAgICAgICBpZihyZXN1bHQpe1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0ID8gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IocXVlcnkpIDogbnVsbDtcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLmNsb3Nlc3RcclxuXHJcbiAgICByZWN1cnNlcyB1cCB0aGUgRE9NIGZyb20gdGhlIHRhcmdldCBub2RlLCBjaGVja2luZyBpZiB0aGUgY3VycmVudCBlbGVtZW50IG1hdGNoZXMgdGhlIHF1ZXJ5XHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuY2xvc2VzdChxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmNsb3Nlc3QodGFyZ2V0LCBxdWVyeSk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiBjbG9zZXN0KHRhcmdldCwgcXVlcnkpe1xyXG4gICAgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCk7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFswXTtcclxuICAgIH1cclxuXHJcbiAgICB3aGlsZShcclxuICAgICAgICB0YXJnZXQgJiZcclxuICAgICAgICB0YXJnZXQub3duZXJEb2N1bWVudCAmJlxyXG4gICAgICAgICFpcyh0YXJnZXQsIHF1ZXJ5KVxyXG4gICAgKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0ID09PSBkb2MuZG9jdW1lbnQgJiYgdGFyZ2V0ICE9PSBxdWVyeSA/IG51bGwgOiB0YXJnZXQ7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5pc1xyXG5cclxuICAgIHJldHVybnMgdHJ1ZSBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgbWF0Y2hlcyB0aGUgcXVlcnlcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5pcyhxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmlzKHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gaXModGFyZ2V0LCBxdWVyeSl7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCF0YXJnZXQub3duZXJEb2N1bWVudCB8fCB0eXBlb2YgcXVlcnkgIT09ICdzdHJpbmcnKXtcclxuICAgICAgICByZXR1cm4gdGFyZ2V0ID09PSBxdWVyeTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0YXJnZXQgPT09IHF1ZXJ5KXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyZW50bGVzcyA9ICF0YXJnZXQucGFyZW50Tm9kZTtcclxuXHJcbiAgICBpZihwYXJlbnRsZXNzKXtcclxuICAgICAgICAvLyBHaXZlIHRoZSBlbGVtZW50IGEgcGFyZW50IHNvIHRoYXQgLnF1ZXJ5U2VsZWN0b3JBbGwgY2FuIGJlIHVzZWRcclxuICAgICAgICBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVzdWx0ID0gYXJyYXlQcm90by5pbmRleE9mLmNhbGwoZmluZCh0YXJnZXQucGFyZW50Tm9kZSwgcXVlcnkpLCB0YXJnZXQpID49IDA7XHJcblxyXG4gICAgaWYocGFyZW50bGVzcyl7XHJcbiAgICAgICAgdGFyZ2V0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuYWRkQ2xhc3NcclxuXHJcbiAgICBhZGRzIGNsYXNzZXMgdG8gdGhlIHRhcmdldCAoc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvciBhcnJheSlcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5hZGRDbGFzcyhxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmFkZENsYXNzKHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gYWRkQ2xhc3ModGFyZ2V0LCBjbGFzc2VzKXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgYWRkQ2xhc3ModGFyZ2V0W2ldLCBjbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBpZighY2xhc3Nlcyl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGNsYXNzZXMgPSBBcnJheS5pc0FycmF5KGNsYXNzZXMpID8gY2xhc3NlcyA6IGNsYXNzZXMuc3BsaXQoc3BhY2UpLFxyXG4gICAgICAgIGN1cnJlbnRDbGFzc2VzID0gdGFyZ2V0LmNsYXNzTGlzdCA/IG51bGwgOiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KHNwYWNlKTtcclxuXHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIGNsYXNzVG9BZGQgPSBjbGFzc2VzW2ldO1xyXG4gICAgICAgIGlmKCFjbGFzc1RvQWRkIHx8IGNsYXNzVG9BZGQgPT09IHNwYWNlKXtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRhcmdldC5jbGFzc0xpc3Qpe1xyXG4gICAgICAgICAgICB0YXJnZXQuY2xhc3NMaXN0LmFkZChjbGFzc1RvQWRkKTtcclxuICAgICAgICB9IGVsc2UgaWYoIWN1cnJlbnRDbGFzc2VzLmluZGV4T2YoY2xhc3NUb0FkZCk+PTApe1xyXG4gICAgICAgICAgICBjdXJyZW50Q2xhc3Nlcy5wdXNoKGNsYXNzVG9BZGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKCF0YXJnZXQuY2xhc3NMaXN0KXtcclxuICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gY3VycmVudENsYXNzZXMuam9pbihzcGFjZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuLyoqXHJcblxyXG4gICAgIyMgLnJlbW92ZUNsYXNzXHJcblxyXG4gICAgcmVtb3ZlcyBjbGFzc2VzIGZyb20gdGhlIHRhcmdldCAoc3BhY2Ugc2VwYXJhdGVkIHN0cmluZyBvciBhcnJheSlcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5yZW1vdmVDbGFzcyhxdWVyeSk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLnJlbW92ZUNsYXNzKHRhcmdldCwgcXVlcnkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3ModGFyZ2V0LCBjbGFzc2VzKXtcclxuICAgIHRhcmdldCA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuXHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3ModGFyZ2V0W2ldLCBjbGFzc2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoIWNsYXNzZXMpe1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjbGFzc2VzID0gQXJyYXkuaXNBcnJheShjbGFzc2VzKSA/IGNsYXNzZXMgOiBjbGFzc2VzLnNwbGl0KHNwYWNlKSxcclxuICAgICAgICBjdXJyZW50Q2xhc3NlcyA9IHRhcmdldC5jbGFzc0xpc3QgPyBudWxsIDogdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdChzcGFjZSk7XHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBjbGFzc1RvUmVtb3ZlID0gY2xhc3Nlc1tpXTtcclxuICAgICAgICBpZighY2xhc3NUb1JlbW92ZSB8fCBjbGFzc1RvUmVtb3ZlID09PSBzcGFjZSl7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQuY2xhc3NMaXN0KXtcclxuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NUb1JlbW92ZSk7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcmVtb3ZlSW5kZXggPSBjdXJyZW50Q2xhc3Nlcy5pbmRleE9mKGNsYXNzVG9SZW1vdmUpO1xyXG4gICAgICAgIGlmKHJlbW92ZUluZGV4ID49IDApe1xyXG4gICAgICAgICAgICBjdXJyZW50Q2xhc3Nlcy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKCF0YXJnZXQuY2xhc3NMaXN0KXtcclxuICAgICAgICB0YXJnZXQuY2xhc3NOYW1lID0gY3VycmVudENsYXNzZXMuam9pbihzcGFjZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkRXZlbnQoc2V0dGluZ3Mpe1xyXG4gICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChzZXR0aW5ncy50YXJnZXQpO1xyXG4gICAgaWYodGFyZ2V0KXtcclxuICAgICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihzZXR0aW5ncy5ldmVudCwgc2V0dGluZ3MuY2FsbGJhY2ssIGZhbHNlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGNvbnNvbGUud2FybignTm8gZWxlbWVudHMgbWF0Y2hlZCB0aGUgc2VsZWN0b3IsIHNvIG5vIGV2ZW50cyB3ZXJlIGJvdW5kLicpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAub25cclxuXHJcbiAgICBiaW5kcyBhIGNhbGxiYWNrIHRvIGEgdGFyZ2V0IHdoZW4gYSBET00gZXZlbnQgaXMgcmFpc2VkLlxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQvcHJveHkpLm9uKGV2ZW50cywgdGFyZ2V0W29wdGlvbmFsXSwgY2FsbGJhY2spO1xyXG5cclxuICAgIG5vdGU6IGlmIGEgdGFyZ2V0IGlzIHBhc3NlZCB0byB0aGUgLm9uIGZ1bmN0aW9uLCBkb2MncyB0YXJnZXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBwcm94eS5cclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2Mub24oZXZlbnRzLCB0YXJnZXQsIHF1ZXJ5LCBwcm94eVtvcHRpb25hbF0pO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gb24oZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eSl7XHJcblxyXG4gICAgcHJveHkgPSBnZXRUYXJnZXRzKHByb3h5KTtcclxuXHJcbiAgICBpZighcHJveHkpe1xyXG4gICAgICAgIHRhcmdldCA9IGdldFRhcmdldHModGFyZ2V0KTtcclxuICAgICAgICAvLyBoYW5kbGVzIG11bHRpcGxlIHRhcmdldHNcclxuICAgICAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgICAgIHZhciBtdWx0aVJlbW92ZUNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRhcmdldC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbXVsdGlSZW1vdmVDYWxsYmFja3MucHVzaChvbihldmVudHMsIHRhcmdldFtpXSwgY2FsbGJhY2ssIHByb3h5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICB3aGlsZShtdWx0aVJlbW92ZUNhbGxiYWNrcy5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpUmVtb3ZlQ2FsbGJhY2tzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBoYW5kbGVzIG11bHRpcGxlIHByb3hpZXNcclxuICAgIC8vIEFscmVhZHkgaGFuZGxlcyBtdWx0aXBsZSBwcm94aWVzIGFuZCB0YXJnZXRzLFxyXG4gICAgLy8gYmVjYXVzZSB0aGUgdGFyZ2V0IGxvb3AgY2FsbHMgdGhpcyBsb29wLlxyXG4gICAgaWYoaXNMaXN0KHByb3h5KSl7XHJcbiAgICAgICAgdmFyIG11bHRpUmVtb3ZlQ2FsbGJhY2tzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm94eS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBtdWx0aVJlbW92ZUNhbGxiYWNrcy5wdXNoKG9uKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHlbaV0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHdoaWxlKG11bHRpUmVtb3ZlQ2FsbGJhY2tzLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICBtdWx0aVJlbW92ZUNhbGxiYWNrcy5wb3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlbW92ZUNhbGxiYWNrcyA9IFtdO1xyXG5cclxuICAgIGlmKHR5cGVvZiBldmVudHMgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBldmVudHMgPSBldmVudHMuc3BsaXQoc3BhY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIHZhciBldmVudFNldHRpbmdzID0ge307XHJcbiAgICAgICAgaWYocHJveHkpe1xyXG4gICAgICAgICAgICBpZihwcm94eSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBwcm94eSA9IGRvYy5kb2N1bWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBldmVudFNldHRpbmdzLnRhcmdldCA9IHByb3h5O1xyXG4gICAgICAgICAgICBldmVudFNldHRpbmdzLmNhbGxiYWNrID0gZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNsb3Nlc3RUYXJnZXQgPSBjbG9zZXN0KGV2ZW50LnRhcmdldCwgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGlmKGNsb3Nlc3RUYXJnZXQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50LCBjbG9zZXN0VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZXZlbnRTZXR0aW5ncy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIGV2ZW50U2V0dGluZ3MuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGV2ZW50U2V0dGluZ3MuZXZlbnQgPSBldmVudHNbaV07XHJcblxyXG4gICAgICAgIGFkZEV2ZW50KGV2ZW50U2V0dGluZ3MpO1xyXG5cclxuICAgICAgICByZW1vdmVDYWxsYmFja3MucHVzaChldmVudFNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICB3aGlsZShyZW1vdmVDYWxsYmFja3MubGVuZ3RoKXtcclxuICAgICAgICAgICAgdmFyIHJlbW92ZUNhbGxiYWNrID0gcmVtb3ZlQ2FsbGJhY2tzLnBvcCgpO1xyXG4gICAgICAgICAgICBnZXRUYXJnZXQocmVtb3ZlQ2FsbGJhY2sudGFyZ2V0KS5yZW1vdmVFdmVudExpc3RlbmVyKHJlbW92ZUNhbGxiYWNrLmV2ZW50LCByZW1vdmVDYWxsYmFjay5jYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAub2ZmXHJcblxyXG4gICAgcmVtb3ZlcyBldmVudHMgYXNzaWduZWQgdG8gYSB0YXJnZXQuXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldC9wcm94eSkub2ZmKGV2ZW50cywgdGFyZ2V0W29wdGlvbmFsXSwgY2FsbGJhY2spO1xyXG5cclxuICAgIG5vdGU6IGlmIGEgdGFyZ2V0IGlzIHBhc3NlZCB0byB0aGUgLm9uIGZ1bmN0aW9uLCBkb2MncyB0YXJnZXQgd2lsbCBiZSB1c2VkIGFzIHRoZSBwcm94eS5cclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2Mub2ZmKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHkpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gb2ZmKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcHJveHkpe1xyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG9mZihldmVudHMsIHRhcmdldFtpXSwgY2FsbGJhY2ssIHByb3h5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBpZihwcm94eSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3h5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG9mZihldmVudHMsIHRhcmdldCwgY2FsbGJhY2ssIHByb3h5W2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodHlwZW9mIGV2ZW50cyA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgIGV2ZW50cyA9IGV2ZW50cy5zcGxpdChzcGFjZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICBwcm94eSA9IGNhbGxiYWNrO1xyXG4gICAgICAgIGNhbGxiYWNrID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm94eSA9IHByb3h5ID8gZ2V0VGFyZ2V0KHByb3h5KSA6IGRvYy5kb2N1bWVudDtcclxuXHJcbiAgICB2YXIgdGFyZ2V0cyA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID8gZmluZCh0YXJnZXQsIHByb3h5KSA6IFt0YXJnZXRdO1xyXG5cclxuICAgIGZvcih2YXIgdGFyZ2V0SW5kZXggPSAwOyB0YXJnZXRJbmRleCA8IHRhcmdldHMubGVuZ3RoOyB0YXJnZXRJbmRleCsrKXtcclxuICAgICAgICB2YXIgY3VycmVudFRhcmdldCA9IHRhcmdldHNbdGFyZ2V0SW5kZXhdO1xyXG5cclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZXZlbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY3VycmVudFRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tpXSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAuYXBwZW5kXHJcblxyXG4gICAgYWRkcyBlbGVtZW50cyB0byBhIHRhcmdldFxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmFwcGVuZChjaGlsZHJlbik7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmFwcGVuZCh0YXJnZXQsIGNoaWxkcmVuKTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIGFwcGVuZCh0YXJnZXQsIGNoaWxkcmVuKXtcclxuICAgIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQodGFyZ2V0KSxcclxuICAgICAgICBjaGlsZHJlbiA9IGdldFRhcmdldChjaGlsZHJlbik7XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFswXTtcclxuICAgIH1cclxuXHJcbiAgICBpZihpc0xpc3QoY2hpbGRyZW4pKXtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGFwcGVuZCh0YXJnZXQsIGNoaWxkcmVuW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldC5hcHBlbmRDaGlsZChjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5wcmVwZW5kXHJcblxyXG4gICAgYWRkcyBlbGVtZW50cyB0byB0aGUgZnJvbnQgb2YgYSB0YXJnZXRcclxuXHJcbiAgICAgICAgLy9mbHVlbnRcclxuICAgICAgICBkb2ModGFyZ2V0KS5wcmVwZW5kKGNoaWxkcmVuKTtcclxuXHJcbiAgICAgICAgLy9sZWdhY3lcclxuICAgICAgICBkb2MucHJlcGVuZCh0YXJnZXQsIGNoaWxkcmVuKTtcclxuKi9cclxuXHJcbmZ1bmN0aW9uIHByZXBlbmQodGFyZ2V0LCBjaGlsZHJlbil7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCksXHJcbiAgICAgICAgY2hpbGRyZW4gPSBnZXRUYXJnZXQoY2hpbGRyZW4pO1xyXG5cclxuICAgIGlmKGlzTGlzdCh0YXJnZXQpKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXRbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaXNMaXN0KGNoaWxkcmVuKSl7XHJcbiAgICAgICAgLy9yZXZlcnNlZCBiZWNhdXNlIG90aGVyd2lzZSB0aGUgd291bGQgZ2V0IHB1dCBpbiBpbiB0aGUgd3Jvbmcgb3JkZXIuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IGNoaWxkcmVuLmxlbmd0aCAtMTsgaTsgaS0tKSB7XHJcbiAgICAgICAgICAgIHByZXBlbmQodGFyZ2V0LCBjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0YXJnZXQuaW5zZXJ0QmVmb3JlKGNoaWxkcmVuLCB0YXJnZXQuZmlyc3RDaGlsZCk7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5pc1Zpc2libGVcclxuXHJcbiAgICBjaGVja3MgaWYgYW4gZWxlbWVudCBvciBhbnkgb2YgaXRzIHBhcmVudHMgZGlzcGxheSBwcm9wZXJ0aWVzIGFyZSBzZXQgdG8gJ25vbmUnXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKHRhcmdldCkuaXNWaXNpYmxlKCk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmlzVmlzaWJsZSh0YXJnZXQpO1xyXG4qL1xyXG5cclxuZnVuY3Rpb24gaXNWaXNpYmxlKHRhcmdldCl7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KHRhcmdldCk7XHJcbiAgICBpZighdGFyZ2V0KXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZihpc0xpc3QodGFyZ2V0KSl7XHJcbiAgICAgICAgdmFyIGkgPSAtMTtcclxuXHJcbiAgICAgICAgd2hpbGUgKHRhcmdldFtpKytdICYmIGlzVmlzaWJsZSh0YXJnZXRbaV0pKSB7fVxyXG4gICAgICAgIHJldHVybiB0YXJnZXQubGVuZ3RoID49IGk7XHJcbiAgICB9XHJcbiAgICB3aGlsZSh0YXJnZXQucGFyZW50Tm9kZSAmJiB0YXJnZXQuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKXtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFyZ2V0ID09PSBkb2MuZG9jdW1lbnQ7XHJcbn1cclxuXHJcbi8qKlxyXG5cclxuICAgICMjIC5pbmRleE9mRWxlbWVudFxyXG5cclxuICAgIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IHdpdGhpbiBpdCdzIHBhcmVudCBlbGVtZW50LlxyXG5cclxuICAgICAgICAvL2ZsdWVudFxyXG4gICAgICAgIGRvYyh0YXJnZXQpLmluZGV4T2ZFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIC8vbGVnYWN5XHJcbiAgICAgICAgZG9jLmluZGV4T2ZFbGVtZW50KHRhcmdldCk7XHJcblxyXG4qL1xyXG5cclxuZnVuY3Rpb24gaW5kZXhPZkVsZW1lbnQodGFyZ2V0KSB7XHJcbiAgICB0YXJnZXQgPSBnZXRUYXJnZXRzKHRhcmdldCk7XHJcbiAgICBpZighdGFyZ2V0KXtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoaXNMaXN0KHRhcmdldCkpe1xyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldFswXTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaSA9IC0xO1xyXG5cclxuICAgIHZhciBwYXJlbnQgPSB0YXJnZXQucGFyZW50RWxlbWVudDtcclxuXHJcbiAgICBpZighcGFyZW50KXtcclxuICAgICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuXHJcbiAgICB3aGlsZShwYXJlbnQuY2hpbGRyZW5bKytpXSAhPT0gdGFyZ2V0KXt9XHJcblxyXG4gICAgcmV0dXJuIGk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuXHJcbiAgICAjIyAucmVhZHlcclxuXHJcbiAgICBjYWxsIGEgY2FsbGJhY2sgd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXHJcblxyXG4gICAgcmV0dXJucyAtMSBpZiB0aGVyZSBpcyBubyBwYXJlbnRFbGVtZW50IG9uIHRoZSB0YXJnZXQuXHJcblxyXG4gICAgICAgIC8vZmx1ZW50XHJcbiAgICAgICAgZG9jKCkucmVhZHkoY2FsbGJhY2spO1xyXG5cclxuICAgICAgICAvL2xlZ2FjeVxyXG4gICAgICAgIGRvYy5yZWFkeShjYWxsYmFjayk7XHJcbiovXHJcblxyXG5mdW5jdGlvbiByZWFkeShjYWxsYmFjayl7XHJcbiAgICBpZihkb2MuZG9jdW1lbnQgJiYgKGRvYy5kb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnIHx8IGRvYy5kb2N1bWVudC5yZWFkeVN0YXRlID09PSAnaW50ZXJhY3RpdmUnKSl7XHJcbiAgICAgICAgY2FsbGJhY2soKTtcclxuICAgIH1lbHNlIGlmKHdpbmRvdy5hdHRhY2hFdmVudCl7XHJcbiAgICAgICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiwgY2FsbGJhY2spO1xyXG4gICAgICAgIHdpbmRvdy5hdHRhY2hFdmVudChcIm9uTG9hZFwiLGNhbGxiYWNrKTtcclxuICAgIH1lbHNlIGlmKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpe1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsY2FsbGJhY2ssZmFsc2UpO1xyXG4gICAgfVxyXG59XHJcblxyXG5kb2MuZmluZCA9IGZpbmQ7XHJcbmRvYy5maW5kT25lID0gZmluZE9uZTtcclxuZG9jLmNsb3Nlc3QgPSBjbG9zZXN0O1xyXG5kb2MuaXMgPSBpcztcclxuZG9jLmFkZENsYXNzID0gYWRkQ2xhc3M7XHJcbmRvYy5yZW1vdmVDbGFzcyA9IHJlbW92ZUNsYXNzO1xyXG5kb2Mub2ZmID0gb2ZmO1xyXG5kb2Mub24gPSBvbjtcclxuZG9jLmFwcGVuZCA9IGFwcGVuZDtcclxuZG9jLnByZXBlbmQgPSBwcmVwZW5kO1xyXG5kb2MuaXNWaXNpYmxlID0gaXNWaXNpYmxlO1xyXG5kb2MucmVhZHkgPSByZWFkeTtcclxuZG9jLmluZGV4T2ZFbGVtZW50ID0gaW5kZXhPZkVsZW1lbnQ7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvYzsiLCJ2YXIgZG9jID0gcmVxdWlyZSgnLi9kb2MnKSxcclxuICAgIGlzTGlzdCA9IHJlcXVpcmUoJy4vaXNMaXN0JyksXHJcbiAgICBnZXRUYXJnZXRzID0gcmVxdWlyZSgnLi9nZXRUYXJnZXRzJykoZG9jLmRvY3VtZW50KSxcclxuICAgIGZsb2NQcm90byA9IFtdO1xyXG5cclxuZnVuY3Rpb24gRmxvYyhpdGVtcyl7XHJcbiAgICB0aGlzLnB1c2guYXBwbHkodGhpcywgaXRlbXMpO1xyXG59XHJcbkZsb2MucHJvdG90eXBlID0gZmxvY1Byb3RvO1xyXG5mbG9jUHJvdG8uY29uc3RydWN0b3IgPSBGbG9jO1xyXG5cclxuZnVuY3Rpb24gZmxvYyh0YXJnZXQpe1xyXG4gICAgdmFyIGluc3RhbmNlID0gZ2V0VGFyZ2V0cyh0YXJnZXQpO1xyXG5cclxuICAgIGlmKCFpc0xpc3QoaW5zdGFuY2UpKXtcclxuICAgICAgICBpZihpbnN0YW5jZSl7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gW2luc3RhbmNlXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaW5zdGFuY2UgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZsb2MoaW5zdGFuY2UpO1xyXG59XHJcblxyXG52YXIgcmV0dXJuc1NlbGYgPSAnYWRkQ2xhc3MgcmVtb3ZlQ2xhc3MgYXBwZW5kIHByZXBlbmQnLnNwbGl0KCcgJyk7XHJcblxyXG5mb3IodmFyIGtleSBpbiBkb2Mpe1xyXG4gICAgaWYodHlwZW9mIGRvY1trZXldID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICBmbG9jW2tleV0gPSBkb2Nba2V5XTtcclxuICAgICAgICBmbG9jUHJvdG9ba2V5XSA9IChmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzO1xyXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGFsc28gZXh0cmVtZWx5IGRvZGd5IGFuZCBmYXN0XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihhLGIsYyxkLGUsZil7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gZG9jW2tleV0odGhpcywgYSxiLGMsZCxlLGYpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHJlc3VsdCAhPT0gZG9jICYmIGlzTGlzdChyZXN1bHQpKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmxvYyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYocmV0dXJuc1NlbGYuaW5kZXhPZihrZXkpID49MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KGtleSkpO1xyXG4gICAgfVxyXG59XHJcbmZsb2NQcm90by5vbiA9IGZ1bmN0aW9uKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjayl7XHJcbiAgICB2YXIgcHJveHkgPSB0aGlzO1xyXG4gICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICAgICAgY2FsbGJhY2sgPSB0YXJnZXQ7XHJcbiAgICAgICAgdGFyZ2V0ID0gdGhpcztcclxuICAgICAgICBwcm94eSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBkb2Mub24oZXZlbnRzLCB0YXJnZXQsIGNhbGxiYWNrLCBwcm94eSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbmZsb2NQcm90by5vZmYgPSBmdW5jdGlvbihldmVudHMsIHRhcmdldCwgY2FsbGJhY2spe1xyXG4gICAgdmFyIHJlZmVyZW5jZSA9IHRoaXM7XHJcbiAgICBpZih0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKXtcclxuICAgICAgICBjYWxsYmFjayA9IHRhcmdldDtcclxuICAgICAgICB0YXJnZXQgPSB0aGlzO1xyXG4gICAgICAgIHJlZmVyZW5jZSA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBkb2Mub2ZmKGV2ZW50cywgdGFyZ2V0LCBjYWxsYmFjaywgcmVmZXJlbmNlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuZmxvY1Byb3RvLnJlYWR5ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgZG9jLnJlYWR5KGNhbGxiYWNrKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuZmxvY1Byb3RvLmFkZENsYXNzID0gZnVuY3Rpb24oY2xhc3NOYW1lKXtcclxuICAgIGRvYy5hZGRDbGFzcyh0aGlzLCBjbGFzc05hbWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5mbG9jUHJvdG8ucmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbihjbGFzc05hbWUpe1xyXG4gICAgZG9jLnJlbW92ZUNsYXNzKHRoaXMsIGNsYXNzTmFtZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZmxvYzsiLCJ2YXIgc2luZ2xlSWQgPSAvXiNcXHcrJC87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9jdW1lbnQpe1xuICAgIHJldHVybiBmdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KXtcbiAgICAgICAgaWYodHlwZW9mIHRhcmdldCA9PT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgaWYoc2luZ2xlSWQuZXhlYyh0YXJnZXQpKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGFyZ2V0LnNsaWNlKDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG59OyIsIlxudmFyIHNpbmdsZUNsYXNzID0gL15cXC5cXHcrJC8sXG4gICAgc2luZ2xlSWQgPSAvXiNcXHcrJC8sXG4gICAgc2luZ2xlVGFnID0gL15cXHcrJC87XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9jdW1lbnQpe1xuICAgIHJldHVybiBmdW5jdGlvbiBnZXRUYXJnZXRzKHRhcmdldCl7XG4gICAgICAgIGlmKHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnKXtcbiAgICAgICAgICAgIGlmKHNpbmdsZUlkLmV4ZWModGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgLy8gSWYgeW91IGhhdmUgbW9yZSB0aGFuIDEgb2YgdGhlIHNhbWUgaWQgaW4geW91ciBwYWdlLFxuICAgICAgICAgICAgICAgIC8vIHRoYXRzIHlvdXIgb3duIHN0dXBpZCBmYXVsdC5cbiAgICAgICAgICAgICAgICByZXR1cm4gW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhcmdldC5zbGljZSgxKSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoc2luZ2xlVGFnLmV4ZWModGFyZ2V0KSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzaW5nbGVDbGFzcy5leGVjKHRhcmdldCkpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRhcmdldC5zbGljZSgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzTGlzdChvYmplY3Qpe1xyXG4gICAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnICYmICdsZW5ndGgnIGluIG9iamVjdCAmJiAhKCdub2RlVHlwZScgaW4gb2JqZWN0KSAmJiBvYmplY3Quc2VsZiAhPSBvYmplY3Q7IC8vIGluIElFOCwgd2luZG93LnNlbGYgaXMgd2luZG93LCBidXQgaXQgaXMgbm90ID09PSB3aW5kb3csIGJ1dCBpdCBpcyA9PSB3aW5kb3cuLi4uLi4uLi4gV1RGIT9cclxufSIsImNvbnN0IHByZWZpeCA9ICdzZXNzaW9uQWNjZXNzSWQtJztcblxuZnVuY3Rpb24gZ2V0SWQoZGF0YSkge1xuICAgIGxldCBpZDtcblxuICAgIGlmIChkYXRhICYmIGRhdGEuaWQgJiYgfmRhdGEuaWQuaW5kZXhPZihwcmVmaXgpKSB7XG4gICAgICAgIGlkID0gZGF0YS5pZDtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SWQ7XG4iLCJjb25zdCBnZXRJZCA9IHJlcXVpcmUoJy4uL2dldElkJyk7XG5jb25zdCBtZXRob2RzID0gcmVxdWlyZSgnLi9tZXRob2RzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RvcmFnZUhvc3QoYWxsb3dlZERvbWFpbnMpIHtcbiAgICBmdW5jdGlvbiBoYW5kbGVNZXNzYWdlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YSB9ID0gZXZlbnQ7XG4gICAgICAgIGNvbnN0IGRvbWFpbiA9IGFsbG93ZWREb21haW5zLmZpbmQoYWxsb3dlZERvbWFpbiA9PiBldmVudC5vcmlnaW4gPT09IGFsbG93ZWREb21haW4ub3JpZ2luKTtcbiAgICAgICAgY29uc3QgaWQgPSBnZXRJZChkYXRhKTtcblxuICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRvbWFpbikge1xuICAgICAgICAgICAgZXZlbnQuc291cmNlLnBvc3RNZXNzYWdlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RFcnJvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGAke2V2ZW50Lm9yaWdpbn0gaXMgbm90IGFuIGFsbG93ZWQgZG9tYWluYCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGV2ZW50Lm9yaWdpbixcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgbWV0aG9kIH0gPSBkYXRhO1xuXG4gICAgICAgIGlmICghfmRvbWFpbi5hbGxvd2VkTWV0aG9kcy5pbmRleE9mKG1ldGhvZCkgJiYgbWV0aG9kICE9PSAnY29ubmVjdCcpIHtcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogYCR7bWV0aG9kfSBpcyBub3QgYW4gYWxsb3dlZCBtZXRob2QgZnJvbSAke2V2ZW50Lm9yaWdpbn1gLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXZlbnQub3JpZ2luLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWV0aG9kc1ttZXRob2RdKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBoYW5kbGVNZXNzYWdlKTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGhhbmRsZU1lc3NhZ2UpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2xvc2UsXG4gICAgfTtcbn07XG4iLCJjb25zdCBjb25uZWN0SWQgPSAnc2Vzc2lvbkFjY2Vzc0lkLWNvbm5lY3RlZCc7XG5jb25zdCBMT0NBTF9TVE9SQUdFID0gJ2xvY2FsU3RvcmFnZSc7XG5jb25zdCBTRVNTSU9OX1NUT1JBR0UgPSAnc2Vzc2lvblN0b3JhZ2UnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZXQoZXZlbnQsIGRhdGEsIHN0b3JhZ2VUeXBlID0gTE9DQUxfU1RPUkFHRSkge1xuICAgICAgICBldmVudC5zb3VyY2UucG9zdE1lc3NhZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWQ6IGRhdGEuaWQsXG4gICAgICAgICAgICAgICAgZGF0YTogd2luZG93W3N0b3JhZ2VUeXBlXS5nZXRJdGVtKGRhdGEua2V5KSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudC5vcmlnaW4sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBzZXQoZXZlbnQsIGRhdGEsIHN0b3JhZ2VUeXBlID0gTE9DQUxfU1RPUkFHRSkge1xuICAgICAgICB3aW5kb3dbc3RvcmFnZVR5cGVdLnNldEl0ZW0oZGF0YS5rZXksIGRhdGEudmFsdWUpO1xuXG4gICAgICAgIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudC5vcmlnaW4sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICByZW1vdmUoZXZlbnQsIGRhdGEsIHN0b3JhZ2VUeXBlID0gTE9DQUxfU1RPUkFHRSkge1xuICAgICAgICB3aW5kb3dbc3RvcmFnZVR5cGVdLnJlbW92ZUl0ZW0oZGF0YS5rZXkpO1xuXG4gICAgICAgIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogZGF0YS5pZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudC5vcmlnaW4sXG4gICAgICAgICk7XG4gICAgfSxcbiAgICBnZXRTZXNzaW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgIHRoaXMuZ2V0KGV2ZW50LCBkYXRhLCBTRVNTSU9OX1NUT1JBR0UpO1xuICAgIH0sXG4gICAgc2V0U2Vzc2lvbihldmVudCwgZGF0YSkge1xuICAgICAgICB0aGlzLnNldChldmVudCwgZGF0YSwgU0VTU0lPTl9TVE9SQUdFKTtcbiAgICB9LFxuICAgIHJlbW92ZVNlc3Npb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoZXZlbnQsIGRhdGEsIFNFU1NJT05fU1RPUkFHRSk7XG4gICAgfSxcbiAgICBjb25uZWN0KGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnNvdXJjZS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZDogY29ubmVjdElkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50Lm9yaWdpbixcbiAgICAgICAgKTtcbiAgICB9LFxufTtcbiIsImNvbnN0IGNyZWwgPSByZXF1aXJlKCdjcmVsJyk7XG5jb25zdCBkb2MgPSByZXF1aXJlKCdkb2MtanMnKTtcbmNvbnN0IGNyZWF0ZVN0b3JhZ2VIb3N0ID0gcmVxdWlyZSgnLi4vLi4vc291cmNlL2hvc3QnKTtcblxuY29uc3QgaW5zdHJ1Y3Rpb25zID0gY3JlbChcbiAgICAnZGl2JyxcbiAgICB7XG4gICAgICAgIGNsYXNzOiAnaW5zdHJ1Y3Rpb25zJyxcbiAgICB9LFxuICAgIGNyZWwoJ2gzJywgJ2Nyb3NzLWRvbWFpbi1zdG9yYWdlIGhvc3QnKSxcbik7XG5cbmRvYy5yZWFkeSgoKSA9PiB7XG4gICAgY3JlbChkb2N1bWVudC5ib2R5LCBpbnN0cnVjdGlvbnMpO1xuXG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmb28nLCAnYmFyJyk7XG4gICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2ZvbycsICdzZXNzaW9uIGJhcicpO1xuXG4gICAgY3JlYXRlU3RvcmFnZUhvc3QoW1xuICAgICAgICB7XG4gICAgICAgICAgICBvcmlnaW46ICdodHRwOi8vbG9jYWxob3N0OjkxMjQnLFxuICAgICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IFsnZ2V0JywgJ3NldCcsICdyZW1vdmUnLCAnZ2V0U2Vzc2lvbicsICdzZXRTZXNzaW9uJywgJ3JlbW92ZVNlc3Npb24nXSxcbiAgICAgICAgfSxcbiAgICBdKTtcblxuICAgIC8vIEF0IHNvbWUgcG9pbnQgLSBzdG9yYWdlSG9zdC5jbG9zZSgpXG59KTtcbiJdfQ==
