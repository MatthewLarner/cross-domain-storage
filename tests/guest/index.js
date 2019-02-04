var crel = require('crel'),
    doc = require('doc-js'),
    createStorageGuest = require('../../guest');

var instructions = crel(
    'div',
    {
        class: 'instructions',
    },
    crel('h3', 'cross-domain-storage guest'),
);

doc.ready(function() {
    crel(document.body, instructions);

    var storageGuest = createStorageGuest('http://localhost:9123');

    // TODO: actually write some tests here
    storageGuest.get('foo', function(error, data) {
        console.log('Guest callback: ', error, data);
    });

    storageGuest.set('foo', 'cabbage', function(error, data) {
        console.log('Set callback:', error, data);
    });
});
