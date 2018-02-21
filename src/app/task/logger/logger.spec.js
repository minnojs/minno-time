import stream from 'mithril-stream';
import createLogStream from './createLogStream';

describe('logger', function(){
    describe('logStream', function(){
        it('should return a stream', function(){
            var $logs = createLogStream(stream(),{});
            expect($logs._state).toBeTruthy();
        });

        it('should apply source[] to settings.logMap', function(){
            var $source = stream();
            var spy = jasmine.createSpy('logMap').and.returnValue(333);
            var $logs = createLogStream($source, {logMap:spy});
            $source([1,2,3,4]);
            expect(spy).toHaveBeenCalledWith(1,2,3,4);
            expect($logs()).toBe(333);
        });

        it('should apply source[] to settings.logger', function(){
            var $source = stream();
            var spy = jasmine.createSpy('transformLogs').and.returnValue(333);
            var $logs = createLogStream($source, {logger:spy});
            $source([1,2,3,4]);
            expect(spy).toHaveBeenCalledWith(1,2,3,4);
            expect($logs()).toBe(333);
        });
    });
});
