/*
  import interactions from './interactions';

describe('interactions', function(){
    it('should return a function', function(){
        expect(typeof interactions(trial)).toBe('function');
    });

    it('should validate the interactions array', function(){
        expect(interactions.bind(null, {})).toThrow();
        expect(interactions.bind(null, {_source:{}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:'a'}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[]}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[1,2]}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[{}]}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[{conditions:[]}]}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[{actions:[]}]}})).toThrow();
        expect(interactions.bind(null, {_source:{interactions:[{conditions:[],actions:[]}]}})).not.toThrow();
    });
});

describe('eventMap', function(){
    it('should pass through the event', function(){
        var event = {};
    });
});
*/
/*
describe('events', function(){
    describe('interactions', function(){
        it('should ensure trial.interactions are valid', function(){
            
        });

        it('should evaluate event', function(){
        });

        it('should activate only interactions that are true', function(){
        });
    });

    describe('action', function(){
    });

    describe('evaluate', function(){
    });
});
*/
