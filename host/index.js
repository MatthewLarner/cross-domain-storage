var getId = require('../getId'),
    methods = require('./methods');

module.exports = function storageHost(allowedDomains) {
    function handleMessage(event) {
        var data = event.data,
            domain = allowedDomains.find(function(domain) {
                return event.origin === domain.origin;
            }),
            id = getId(data);

        if(!id) {
            return;
        }

        if(!domain) {
            event.source.postMessage({
                id: id,
                error: event.origin + ' is not an allowed domain'
            }, event.origin);

            return;
        }

        var method = data.method;

        if(!~domain.allowedMethods.indexOf(method) && method !== 'connect') {
            event.source.postMessage({
                id: id,
                error: method + ' is not an allowed method from ' + event.origin
            }, event.origin);

            return;
        }

        methods[method](event, data);
    }

    function close() {
        window.removeEventListener('message', handleMessage);
    }

    window.addEventListener('message', handleMessage);

    storageHost.close = close;

    return storageHost;
};
