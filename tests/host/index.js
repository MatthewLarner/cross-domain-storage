const crel = require('crel');
const doc = require('doc-js');
const createStorageHost = require('../../source/host');

const instructions = crel(
    'div',
    {
        class: 'instructions',
    },
    crel('h3', 'cross-domain-storage host'),
);

doc.ready(() => {
    crel(document.body, instructions);

    window.localStorage.setItem('foo', 'bar');
    window.sessionStorage.setItem('foo', 'session bar');

    createStorageHost([
        {
            origin: 'http://localhost:9124',
            allowedMethods: ['get', 'set', 'remove', 'getSession', 'setSession', 'removeSession'],
        },
    ]);

    // At some point - storageHost.close()
});
