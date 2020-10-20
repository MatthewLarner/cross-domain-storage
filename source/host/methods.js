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
