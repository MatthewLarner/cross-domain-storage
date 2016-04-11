var crel = require('crel'),
    doc = require('doc-js'),
    createStorageHost = require('../../host');

var instructions = crel('div', {
        class: 'instructions'
    },
    crel('h3', 'cross-domain-storage host')
);

doc.ready(function() {
    crel(document.body,
        instructions
    );

    window.localStorage.setItem('foo', JSON.stringify('bar'));

    var storageHost = createStorageHost([
        {
            origin: 'http://localhost:9124',
            allowedMethods: ['get', 'set', 'remove']
        }
    ]);

    // At some point - storageHost.close()
});
