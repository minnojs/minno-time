import canvasSetup from './canvasSetup';

describe('canvas', function(){
    var canvas;

    beforeEach(function(){
        canvas = document.createElement('div');
        document.body.appendChild(canvas);
    });

    it('should throw if canvas is not an element', function(){
        expect(function(){
            canvasSetup({},{});
        }).toThrow();
    });

    it('should apply and remove "minno-canvas" to canvas', function(){
        var $resize = canvasSetup(canvas);
        expect(/\bminno-canvas\b/.test(canvas.className)).toBeTruthy();
        $resize.end(true);
        expect(/\bminno-canvas\b/.test(canvas.className)).not.toBeTruthy();
    });

    it('should apply style changes', function(){
        canvasSetup(canvas,{
            background 			: 'rgba(0, 0, 255, 0)',
            canvasBackground	: 'rgba(255, 0, 0, 0)',
            borderColor			: 'rgb(0, 255, 0)',
            borderWidth			: '10px',
            css                 : {paddingTop: '2px'}
        });

        var computedStyle = window.getComputedStyle(canvas);

        // common properties
        expect(window.getComputedStyle(document.body).backgroundColor).toBe('rgba(0, 0, 255, 0)');
        expect(computedStyle.backgroundColor).toBe('rgba(255, 0, 0, 0)');
        expect(computedStyle.borderColor).toBe('rgb(0, 255, 0)');
        // expect(computedStyle.borderWidth).toBe('10px'); // seems that phantomjs has a bug with borderWidth

        // generic css
        expect(computedStyle.paddingTop).toBe('2px');
    });

    it('should map over window resize and orientation change', function(){

    });

});
