Allows sharing of local storage across domains.

Use a host to give access to local storage.

Use a guest to gain access to the local storage on a host.

## Install

npm i cross-domain-storage

## Usage

### Host

```javascript
var createHost = require('cross-domain-storage/host');
```

#### host(allowedDomains)

Call with an array of allowed domains.

```javascript
var storageHost = createHost([
    {
        origin: 'http://www.foo.com',
        allowedMethods: ['get', 'set', 'remove'],
    },
    {
        origin: 'http://www.bar.com',
        allowedMethods: ['get'],
    },
]);
```

#### host.close()

```javascript
storageHost.close();
// storageHost will no longer allow access from guests and can no longer be used.
```

### Guest

```javascript
var createGuest = require('cross-domain-storage/guest');
```

#### guest(hostURL)

Create a guest and connect to the host.

Any methods that are called while connecting are queued up and handled seamlessly.

```javascript
// Hosted on http://www.foo.com
var bazStorage = createGuest('http://www.baz.com/accessStorage');
```

#### guest.get(key, callback)

```javascript
bazStorage.get('fizz', function(error, value) {
    // value for the key of 'fizz' will be retrieved from localStorage on www.baz.com
});
```

#### guest.set(key, value, callback)

_NOTE: The keys and the values in localStorage are always strings thus objects, numbers etc used as keys or values will be automatically converted to strings._

```javascript
bazStorage.set('foo', 'bar', function(error, data) {
    // foo is now set to 'bar'
});
```

#### guest.remove(key, callback)

```javascript
bazStorage.remove('foo', function(error, data) {
    // foo is now removed
});
```

#### guest.close()

```javascript
bazStorage.close();
//connection is now closed and bazStorage can no longer be used.
```
