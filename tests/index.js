var StaticServer = require('static-server'),
    hostServer = new StaticServer({
        rootPath: './tests/host',
        port: 9123
    }),
    guestServer = new StaticServer({
        rootPath: './tests/guest',
        port: 9124
    }),
    fs = require('fs'),
    open = require('open'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    hostBundler = browserify({
        entries: ['tests/host/index.js'],
        cache: {},
        packageCache: {},
        plugin: [watchify],
        debug: true
    }),
    guestBundler = browserify({
        entries: ['tests/guest/index.js'],
        cache: {},
        packageCache: {},
        plugin: [watchify],
        debug: true
    });

function bundleHost() {
    hostBundler.bundle().pipe(fs.createWriteStream('./tests/host/index.browser.js'));
}

hostBundler.on('update', bundleHost);
bundleHost();

function bundleGuest() {
    guestBundler.bundle().pipe(fs.createWriteStream('./tests/guest/index.browser.js'));
}

guestBundler.on('update', bundleGuest);
bundleGuest();

hostServer.start();
guestServer.start();

open('http://localhost:9123');
open('http://localhost:9124');
