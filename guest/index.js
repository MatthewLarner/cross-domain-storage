var crel = require('crel');
var prefix = 'sessionAccessId-';
var getId = require('../getId');

function createId() {
    return prefix + Date.now();
}

module.exports = function storageGuest(source, parent) {
    parent = parent || document.body;

    var iframe;
    var contentWindow;
    var callbacks = {};
    var sessionRequests = [];
    var connected = false;
    var closed = true;
    var connectedTimeout;
    var isLoaded = false;

    iframe = crel('iframe', {
        src: source,
        width: 0,
        height: 0,
        style: 'display: none;',
        onload: function() {
            isLoaded = true;
        },
    });

    function openStorage() {
        parent.appendChild(iframe);
        contentWindow = iframe.contentWindow;
        closed = false;

        window.addEventListener('message', handleMessage);

        checkConnected();
    }

    openStorage();

    function handleMessage(event) {
        var response = event.data;
        var sessionAccessId = getId(response);

        if (sessionAccessId === 'sessionAccessId-connected') {
            connected = true;
            return;
        }

        if (response.connectError) {
            for (var key in callbacks) {
                if (callbacks[key]) {
                    callbacks[key](response.error);
                }
            }

            callbacks = {};

            return;
        }

        var callback = callbacks[sessionAccessId];

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
            sessionRequests.push(arguments);
        }

        var id = createId();

        callbacks[id] = callback;

        if (isLoaded) {
            contentWindow.postMessage(
                {
                    method: method,
                    key: key,
                    value: value,
                    id: id,
                },
                source
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
                message.apply(null, sessionRequests.pop());
            }

            return;
        }

        message('connect');

        connectedTimeout = setTimeout(checkConnected, 125);
    }

    return {
        get: get,
        set: set,
        remove: remove,
        close: close,
    };
};
