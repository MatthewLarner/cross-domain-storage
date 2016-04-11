var connectId = 'sessionAccessId-connected',
    parseJSON = require('try-parse-json');

function parseJSONValue(value){
    if(value == null) {
        return value;
    }

    var result = parseJSON(value);

    if(result instanceof Error) {
        result = null;
    }

    return result;
}

module.exports = {
    get: function(event, data) {
        event.source.postMessage({
            id: data.id,
            data: parseJSONValue(window.localStorage.getItem(data.key))
        }, event.origin);
    },
    set: function(event, data) {
        window.localStorage.setItem(data.key, JSON.stringify(data.value));

        event.source.postMessage({
            id: data.id
        }, event.origin);
    },
    remove: function(event, data) {
        window.localStorage.removeItem(data.key, data.value);

        event.source.postMessage({
            id: data.id
        }, event.origin);
    },
    connect: function(event) {
        event.source.postMessage({
            id: connectId
        }, event.origin);
    }
};
