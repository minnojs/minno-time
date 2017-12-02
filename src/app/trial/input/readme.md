## interface

The interface is responsible for listening to user actions and creating appropriate events.

### Signature

```javascript
var interface = Interface($stream, trial);
```

Argument    | Type      | Description
----------- | --------- | ----------------
$events     | Stream    | The stream of events the the interface publishes into.
trial       | Trial     | The trial that this interface is working with (trial is used to get access to the canvas as well as trial id etc. for identification).

### Methods

Name        | arguments     | Description
----------- | ------------- | ----------- 
add         | inputObject   | add listener.
remove      | handle        | remove listeners by handle.
removeAll   |               | remove all listeners.
resetTimer  |               | set latency relative to now.

```javascript
interface.add({handle:'startHandle', on:'space'});
interface.remove('startHandle');
interface.removeAll();
interface.resetTimer();
```

### Listeners
Listeners are streams with an extra property `handle`.

```javascript
var $listerne = stream();
$listener.handle = 'listenerHandle';
```

You can create a listener by using a function, or using input objects as defined in the `binder`.
