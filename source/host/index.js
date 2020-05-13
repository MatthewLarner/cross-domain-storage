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
