const crel = require('crel');
const doc = require('doc-js');
const createStorageGuest = require('../../guest');

const instructions = crel('div', crel('h3', 'cross-domain-storage guest'), 'If not all green then view the console.');

/* eslint-disable */

// TODO: Make actualy tests not just this nested nightmare
doc.ready(() => {
    crel(document.body, instructions);
    const storageGuest = createStorageGuest('http://localhost:9123');

    storageGuest.get('foo', (error, data) => {
        console.log('1. foo should be bar: ', { error, data });
        crel(instructions, crel('div', { style: `color:${data === 'bar' ? 'green' : 'red'}` }, 'foo should be "bar"'));

        storageGuest.set('foo', 'cabbage', (error, data) => {
            console.log('2. set cabbage:', { error, data });

            storageGuest.get('foo', (error, data) => {
                console.log('3. foo should be cabbage: ', { error, data });
                crel(
                    instructions,
                    crel(
                        'div',
                        {
                            style: `color:${data === 'cabbage' ? 'green' : 'red'}`,
                        },
                        'foo should be "cabbage"',
                    ),
                );

                storageGuest.remove('foo', (error, data) => {
                    console.log('4. foo removed: ', { error, data });

                    storageGuest.get('foo', (error, data) => {
                        console.log('5. foo should be empty: ', { error, data });
                        crel(
                            instructions,
                            crel('div', { style: `color:${!data ? 'green' : 'red'}` }, 'foo should be empty'),
                        );

                        storageGuest.set('foo', { beep: 'boop' }, (error, data) => {
                            console.log('6. set an object: ', { error, data });

                            storageGuest.get('foo', (error, data) => {
                                console.log('7. foo should be [object Object]: ', { error, data });
                                crel(
                                    instructions,
                                    crel(
                                        'div',
                                        { style: `color:${data === '[object Object]' ? 'green' : 'red'}` },
                                        'foo should be [object Object]',
                                    ),
                                );
                            });
                        });
                    });
                });
            });
        });
    });
});

/*  eslint-enable */
