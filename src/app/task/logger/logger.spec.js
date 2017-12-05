import {buildPost} from './poster';

describe('serialize', function(){
    it('should return not encode logs', function(){
        expect(buildPost([{a:1}])).toBe('json=[{"a":1}]');
    });

    it('should encode meta', function(){
        expect(buildPost([], {'a b':'c?%d'})).toBe('json=[]&a+b=c%3F%25d');
    });
});
