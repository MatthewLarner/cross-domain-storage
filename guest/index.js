
var crel = require('crel'),
    prefix = 'sessionAccessId-',
    getId = require('../getId'),
    sessionRequests = [],
    connected = false;

function createId() {
    return prefix + Date.now();
}

var iframe,
    contentWindow,
    callbacks = {};

function handleMessage(event) {
    var response = event.data,
        sessionAccessId = getId(response);

    if(sessionAccessId === 'sessionAccessId-connected') {
        connected = true;
        return;
    }

    var callback = callbacks[sessionAccessId];

    if(sessionAccessId && callback) {
        callback(response.error, response.data);
    }
}


function close() {
    window.removeEventListener('message', handleMessage);
    iframe.remove();
}

module.exports = function storageGuest(source, parent) {
    parent = parent || document.body;

    iframe = crel('iframe', {
            src: source,
            width: 0,
            height: 0,
            style: 'display: none;'
        }
    );

    parent.appendChild(iframe);

    function message(method, key, value, callback) {
        if(!connected && method !== 'connect') {
            sessionRequests.push(Array.prototype.slice.call(arguments));
        }

        var id = createId();

        callbacks[id] = callback;

        contentWindow.postMessage({
            method: method,
            key: key,
            value: value,
            id: id
        }, source);
    }

    function get(key, callback) {
        if(!callback) {
            throw(new Error('callback required for get'));
        }

        message('get', key, null, callback);
    }

    function set(key, value, callback) {
        message('set', key, value, null, callback);
    }

    function remove(key, callback) {
        message('remove', key, null, callback);
    }

    function checkConnected() {
        if (connected) {
            while(sessionRequests.length) {
                message.apply(null, sessionRequests.pop());
            }

            return;
        }

        message('connect');

        setTimeout(checkConnected, 100);
    }

    if(!contentWindow) {
        contentWindow = iframe.contentWindow;

        window.addEventListener('message', handleMessage);

        checkConnected();
    }

    storageGuest.get = get;
    storageGuest.set = set;
    storageGuest.remove = remove;
    storageGuest.close = close;

    return storageGuest;
};
