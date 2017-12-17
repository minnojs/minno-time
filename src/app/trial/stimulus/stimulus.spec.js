import stimulusCollection from './stimulusCollection';

describe('stimuli', function(){

    var trial, canvas;
    
    function stimuli(trialSource){
        canvas = document.createElement('div');
        trial = { _source: trialSource };
        return stimulusCollection(trial,canvas);
    }
    
    describe('collection', function(){
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
    });

    describe('media', function(){
        function media(media){ return stimuli({layout:[{media:media}]}); }

        describe('word', function(){
            it('should render', function(){
                return media({word:'thing'}).ready.then(function(){
                    expect(canvas.firstChild.innerHTML).toBe('thing');
                });
            });

            it('should render plain sting', function(){
                return media('thing').ready.then(function(){
                    expect(canvas.firstChild.innerHTML).toBe('thing');
                });
            });

            it('should not render html', function(){
                return media('<div>thing</thing>').ready.then(function(){
                    expect(canvas.firstChild.textContent).toBe('<div>thing</thing>');
                });
            });
        });

        it('should render full html', function(){
            return media({html:'<div>thing</div>'}).ready.then(function(){
                expect(canvas.firstChild.textContent).toBe('thing');
                expect(canvas.firstChild.children.length).toBe(1);
            });
        });

        it('should render full html', function(){
            var src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            return media({image:src}).ready.then(function(){
                expect(canvas.firstChild.tagName.toLowerCase()).toBe('img');
                expect(canvas.firstChild.src).toBe(src);
            });
        });
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
