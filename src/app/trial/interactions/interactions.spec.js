import {validateInteractions} from './interactions';
import Trial from '../Trial';

describe('interactions', function(){

    fdescribe('map', function(){
        var trial;
        function truthy(){return true;}
        function falsy(){return false;}
        function interact(interactionsArr){ 
            trial = new Trial({interactions:interactionsArr}); 
            return trial.start();
        }

        it('should call actions when conditions are truthy', function(){
            var trueSpy = jasmine.createSpy('trueSpy');
            var falseSpy = jasmine.createSpy('falseSpy');

            return interact([
                {conditions:[truthy], actions:[trueSpy]},
                {conditions:[falsy], actions:[falseSpy]}
            ])
                .then(function(){
                    trial.$events({});

                    expect(trueSpy).toHaveBeenCalled();
                    expect(falseSpy).not.toHaveBeenCalled();
                });
        });

        it('should call conditions/actions with the correct arguments', function(){
            var condition = jasmine.createSpy('conditionSpy').and.returnValue(true);
            var action = jasmine.createSpy('actionSpy');
            var event = {a:123};

            return interact([
                {conditions: [condition], actions: [action]}
            ])
                .then(function(){
                    trial.$events(event);

                    // @TODO: the order of arguments should be the same
                    expect(condition).toHaveBeenCalledWith(event, condition, trial);
                    expect(action).toHaveBeenCalledWith(action, event, trial);
                });
        });

        it('should throw if we have an infinit recursion', function(){
            return interact([
                {conditions: [truthy], actions: [function(action,event,trial){trial.$events({});}]}
            ])
                .then(function(){
                    expect(function(){
                        trial.$events(event);
                    }).toThrowError(Error, /infinite loop/);
                });
        });

        it('should not evaluate interactions after "endTrial" was called', function(){
            var spy = jasmine.createSpy();
            return interact([
                {conditions:[truthy],actions:[{type:'endTrial'}]},
                {conditions:[truthy],actions:[spy]}
            ])
                .then(function(){
                    trial.$events({});
                    expect(spy).not.toHaveBeenCalled();
                });
        });


    });

    describe('validate', function(){
        function validate(arr){ return validateInteractions.bind(null, arr); }

        it('should not accept non objects interactions', function(){
            expect(validate([function(){}])).toThrow();
            expect(validate([undefined])).toThrow();
            expect(validate(['string'])).toThrow();
            expect(validate([123])).toThrow();
            expect(validate([[]])).toThrow();
        });

        it('should not accept empty interactions', function(){
            expect(validate(null)).toThrow();
            expect(validate([])).toThrow();
        });

        it('should require both conditions and actions', function(){
            expect(validate([{}])).toThrow();
            expect(validate([{conditions:[]}])).toThrow();
            expect(validate([{actions:[]}])).toThrow();
            expect(validate([{conditions:[],actions:[]}])).not.toThrow();
        });
    });

});
