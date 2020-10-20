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

    function getSession(key, callback) {
        if (!callback) {
            throw new Error('callback required for get');
        }

        message('getSession', key, null, callback);
    }

    function setSession(key, value, callback) {
        message('setSession', key, value, callback);
    }

    function removeSession(key, callback) {
        message('removeSession', key, null, callback);
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
        getSession,
        setSession,
        removeSession,
        close,
    };
};
