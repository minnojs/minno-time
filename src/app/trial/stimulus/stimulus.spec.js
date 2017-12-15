import stimulusCollection from './stimulusCollection';

describe('stimuli', function(){
    var trial, canvas;
    
    function stimuli(trialSource){
        canvas = document.createElement('div');
        trial = { _source: trialSource };
        return stimulusCollection(trial,canvas);
    }
    
    it('should append all stimuli but not show them', function(){
        var collection = stimuli({stimuli:[{media:'hello'},{media:'world'}]});
        return collection.ready.then(function(){
            expect(canvas.children.length).toBe(2, 'all are appended');
            expect(canvas.children[0].classList.contains('minno-stimulus-visible')).not.toBeTruthy('1st element not visible');
            expect(canvas.children[1].classList.contains('minno-stimulus-visible')).not.toBeTruthy('2st element not visible');
        });
    });

    it('should append all layout and show them', function(){
        var collection = stimuli({layout:[{media:'hello'},{media:'world'}]});
        return collection.ready.then(function(){
            expect(canvas.children.length).toBe(2, 'all are appended');
            expect(canvas.children[0].classList.contains('minno-stimulus-visible')).toBeTruthy('1st element visible');
            expect(canvas.children[1].classList.contains('minno-stimulus-visible')).toBeTruthy('2st element visible');
        });
    });

    it('should merge stimuli and layout', function(){
        var collection = stimuli({layout:[{media:'hello'}], stimuli:[{media:'world'}]});
        return collection.ready.then(function(){
            expect(canvas.children.length).toBe(2, 'all are appended');
            expect(canvas.children[0].classList.contains('minno-stimulus-visible')).not.toBeTruthy('1st element not visible');
            expect(canvas.children[1].classList.contains('minno-stimulus-visible')).toBeTruthy('2st element visible');
        });
    });

    it('should be ready only after all stimuli complete loading', function(){
        var doneSpy = jasmine.createSpy('done');
        var end;
        var media = function(){ return new Promise(function(resolve){ end = resolve; }); };

        var collection = stimuli({stimuli:[{media:media}]});
        collection.ready.then(doneSpy);
        expect(doneSpy).not.toHaveBeenCalled();
        end(document.createElement('div'));
        return collection.ready; // will faile if isn't eventually resolved
    });

    describe('validate', function(){
        function validate(source){ return stimuli.bind(null, source); }

        it('should be ok with no stimuli', function(){
            expect(validate({})).not.toThrow();
        });

        it('should throw for non arrays', function(){
            expect(validate({stimuli:1})).toThrow();
            expect(validate({stimuli:'a'})).toThrow();
            expect(validate({stimuli:{}})).toThrow();
            expect(validate({layout:1})).toThrow();
            expect(validate({layout:'a'})).toThrow();
            expect(validate({layout:{}})).toThrow();
        });

        it('should not allow stimuli without media', function(){
            expect(validate({stimuli:[{media:1},{}]})).toThrow();
            expect(validate({layout:[{media:1},{}]})).toThrow();
        });
    });
});

describe('stimulus', function(){
});
