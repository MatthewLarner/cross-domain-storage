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
