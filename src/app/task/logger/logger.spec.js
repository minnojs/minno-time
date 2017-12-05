import {buildPost,buildPostOld} from './poster';

describe('serialize', function(){
    it('should serialize correctly', function(){
        expect(buildPost({a:1},{meta:123})).toBe('{"data":{"a":1},"meta":123}');
    });

    it('should return not encode logs', function(){
        expect(buildPostOld([{a:1}])).toBe('json=[{"a":1}]');
    });

    it('should encode meta', function(){
        expect(buildPostOld([], {'a b':'c?%d'})).toBe('json=[]&a+b=c%3F%25d');
    });
});
