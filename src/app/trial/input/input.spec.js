import stream from 'mithril-stream';
import simulant from 'simulant';
import Input from './input';

describe('input', function(){
    var input, canvas, events;

    beforeEach(function(){
        
        canvas = document.createElement('div');
        events = jasmine.createSpy();
        input = Input(events, canvas);
        document.body.appendChild(canvas);
    });

    it('should create an object', function(){
        var input = Input();
        expect(typeof input.add).toBe('function');
        expect(typeof input.remove).toBe('function');
        expect(typeof input.removeAll).toBe('function');
        expect(typeof input.resetTimer).toBe('function');
    });

    it('add and remove', function(){
        var $listener = stream();
        $listener.handle = 'myHandle';

        input.add(function(){return $listener;});
        expect(events).not.toHaveBeenCalled();
        $listener(123);
        expect(events.calls.count()).toBe(1);


        // it should create a correct event
        var event = events.calls.argsFor(0)[0];
        expect(event.handle).toBe('myHandle', 'event includes handle');
        expect(event.event).toBe(123, 'event includes listener event');

        // should remove a listener
        input.remove('myHandle');
        $listener(123);
        expect(events.calls.count()).toBe(1, 'events should no respond to listener');
        expect($listener._state.state).toBe(2, '$listener should end');
    });

    describe('keypressed', function(){
        function press(which){
            simulant.fire(canvas, 'keydown', {which:which});
            simulant.fire(canvas, 'keyup', {which:which});
        }

        it('should work raw', function(){
            input.add({handle:'kp', on:'keypressed', key:'A'});
            input.add({handle:'kp', on:'keypressed', key:66});
            input.add({handle:'kp', on:'keypressed', key: ['C',68] });

            press(65); // A
            press(66); // B
            press(67); // C
            press(68); // D
            press(69); // E

            expect(events.calls.count()).toBe(4, 'should activate for each of A to D');

            input.removeAll();

            press(65); // A
            press(66); // B
            press(67); // C
            press(68); // D
            expect(events.calls.count()).toBe(4, 'after removing, do not respond to keypresses');
        });

        it('should respect enter', function(){
            input.add({on:'enter'});
            press(13);
            expect(events.calls.count()).toBe(1);
        });

        it('should respect space', function(){
            input.add({on:'space'});
            press(32);
            expect(events.calls.count()).toBe(1);
        });

        it('should respect esc', function(){
            input.add({on:'esc'});
            press(27);
            expect(events.calls.count()).toBe(1);
        });
    });

    describe('keyup', function(){
        function press(which){
            simulant.fire(canvas, 'keyup', {which:which});
        }

        it('should work', function(){
            input.add({handle:'kp', on:'keyup', key:'A'});
            input.add({handle:'kp', on:'keyup', key:66});
            input.add({handle:'kp', on:'keyup', key: ['C',68] });

            press(65); // A
            press(66); // B
            press(67); // C
            press(68); // D
            press(69); // E

            expect(events.calls.count()).toBe(4, 'should activate for each of A to D');

            input.removeAll();

            press(65); // A
            press(66); // B
            press(67); // C
            press(68); // D
            expect(events.calls.count()).toBe(4, 'after removing, do not respond to keyup');
        });
    });

    ['mousedown', 'mouseup', 'mouseover', 'mouseout'].forEach(function(eventName){
        describe(eventName, function(){
            it('should work with stimulus', function(){
                var target = document.createElement('div');
                target.setAttribute('data-handle', 'myHandle');
                canvas.appendChild(target);

                input.add({handle:'me',on:eventName, stimHandle:'myHandle'});
                simulant.fire(target, eventName);
                expect(events.calls.count()).toBe(1);
            });

            it('should work with element', function(done){
                var target = document.createElement('div');
                input.add({handle:'me',on:eventName, element:target});
                // wait until after fastdom inserts element
                requestAnimationFrame(function(){
                    simulant.fire(target, eventName);
                    expect(events.calls.count()).toBe(1);
                    done();
                }); 
            });
        });
    });
});
