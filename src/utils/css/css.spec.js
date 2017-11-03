import css from './css';

describe('css', function(){
    it('should apply styles ', function(){
        var el = document.createElement('div');
        css(el, {fontFamily:'sans-serif'});
        expect(el.style.fontFamily).toBe('sans-serif');
    });

    it('should camel case when needed', function(){
        var el = document.createElement('div');
        css(el, {'font-family':'sans-serif'});
        expect(el.style.fontFamily).toBe('sans-serif');
    });
});
