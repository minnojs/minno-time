import {validateInteractions} from './interactions';

describe('interactions', function(){

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
