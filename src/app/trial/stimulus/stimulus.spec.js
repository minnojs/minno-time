import stimulusCollection from './stimulusCollection';

describe('stimuli', function(){

    var trial, canvas;
    var CANVAS_WIDTH = 150;
    var CANVAS_HEIGHT = 100;
    
    function stimuli(trialSource){
        canvas = document.createElement('div');
        canvas.classList.add('minno-canvas');
        canvas.style.height = CANVAS_HEIGHT + 'px';
        canvas.style.width = CANVAS_WIDTH + 'px';
        canvas.style.border = 0; //remove border for easyness in measuring

        document.body.appendChild(canvas);
        trial = { _source: trialSource, $messages: console.error};
        return stimulusCollection(trial,canvas);
    }
    function stimulus(stim){ return stimuli({layout:[stim]}); }
    
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

    describe('location', function(){
        it('should center by default', function(){
            return stimulus({media:'hello'}).ready.then(function(){
                var canvasLocation = canvas.getBoundingClientRect();
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.left - canvasLocation.left).toBeCloseTo(canvasLocation.right - stimLocation.right , 1, 'centered on y');
                expect(stimLocation.top - canvasLocation.top).toBeCloseTo(canvasLocation.bottom - stimLocation.bottom , 1, 'centered on x');
            });
        });

        it('should center on y only', function(){
            return stimulus({media:'hello', location:{left:0}}).ready.then(function(){
                var canvasLocation = canvas.getBoundingClientRect();
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.left - canvasLocation.left).toBeCloseTo(0, 1, 'not centered on x');
                expect(stimLocation.top - canvasLocation.top).toBeCloseTo(canvasLocation.bottom - stimLocation.bottom , 1, 'centered on y');
            });
        });

        it('should center on x only', function(){
            return stimulus({media:'hello', location:{top:0}}).ready.then(function(){
                var canvasLocation = canvas.getBoundingClientRect();
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.left - canvasLocation.left).toBeCloseTo(canvasLocation.right - stimLocation.right , 1, 'centered on x');
                expect(stimLocation.top - canvasLocation.top).toBeCloseTo(0 , 1, 'not centered on y');
            });
        });

        it('should locate by percent', function(){
            return stimulus({media:{html:'<div></div>'}, location:{left:30,top:20}}).ready.then(function(){
                var canvasLocation = canvas.getBoundingClientRect();
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.left - canvasLocation.left).toBeCloseTo(CANVAS_WIDTH * 0.3, 1, 'left is 30%');
                expect(stimLocation.top - canvasLocation.top).toBeCloseTo(CANVAS_HEIGHT * 0.2, 1, 'top is 20%');
            });
        });
    });

    describe('size', function(){
        it('should size on both dimensions', function(){
            return stimulus({media:{html:'<div></div>'}, size:{height:30,width:20}}).ready.then(function(){
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.width).toBe(CANVAS_WIDTH * 0.2, 1, 'size.width');
                expect(stimLocation.height).toBe(CANVAS_HEIGHT * 0.3, 1, 'size.height');
            });
        });

        it('should not set size for word media', function(){
            return stimulus({media:'word', size:{height:70,width:20}}).ready.then(function(){
                var stimLocation = canvas.firstChild.getBoundingClientRect();
                expect(stimLocation.width).toBe(CANVAS_WIDTH * 0.2, 1, 'size.width');
                expect(stimLocation.height).not.toBe(CANVAS_HEIGHT * 0.7, 1, 'size.height');
            });
        });

        it('should respect size.fontSize', function(){
            return stimulus({media:'word', size:{font_size:'2em'}}).ready.then(function(){
                expect(canvas.firstChild.style.fontSize).toBe('2em');
            });
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

        it('should render images', function(){
            var src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            return media({$image:src}).ready.then(function(){
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
