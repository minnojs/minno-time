import 'jasmine-ajax';
import stream from 'mithril-stream';
import createLogStream from './createLogStream';
import {buildPost,buildPostOld} from './poster';

describe('logger', function(){
    describe('logStream', function(){
        it('should return a stream', function(){
            var $logs = createLogStream(stream(),{});
            expect($logs._state).toBeTruthy();
        });

        it('should apply source[] to settings.transformLogs', function(){
            var $source = stream();
            var spy = jasmine.createSpy('transformLogs').and.returnValue(333);
            var $logs = createLogStream($source, {transformLogs:spy});
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

        it('should call settings.poster with $logs', function(){
            var $source = stream();
            var spy = jasmine.createSpy('poster');
            var settings = {poster:spy};
            var $logs = createLogStream($source,settings);
            expect(spy).toHaveBeenCalledWith($logs, settings, jasmine.any(Function));
        });
    });

    fdescribe('default poster', function(){
        beforeEach(jasmine.Ajax.install.bind(jasmine.Ajax));
        afterEach(jasmine.Ajax.uninstall.bind(jasmine.Ajax));

        function logs(settings){ return createLogStream(stream(), settings); }
        
        it('should send when done', function(){
            var spy = jasmine.createSpy('serialize').and.returnValue('sentValue');
            var $logs = logs({serialize:spy,url:'/url'});
            $logs(1);
            $logs(1);
            $logs(1);
            $logs(1);
            expect(jasmine.Ajax.requests.mostRecent()).not.toBeDefined();

            $logs.end(true);
            var request = (jasmine.Ajax.requests.mostRecent());
            expect(request.url).toBe('/url');
            expect(request.params).toBe('sentValue');
            expect(spy).toHaveBeenCalledWith([1,1,1,1], undefined);
        });

        it('should respect pulse', function(){
            var spy = jasmine.createSpy('serialize').and.callFake(function(arr){ return arr.join('');});
            var $logs = logs({serialize:spy,url:'/url', pulse:2});
            $logs(1);
            expect(jasmine.Ajax.requests.count()).toBe(0);
            $logs(2);
            expect(jasmine.Ajax.requests.count()).toBe(1);
            expect(jasmine.Ajax.requests.mostRecent().params).toBe('12');

            $logs(3);
            $logs(4);
            expect(jasmine.Ajax.requests.count()).toBe(2);
            expect(jasmine.Ajax.requests.mostRecent().params).toBe('34');

            // not pulsed
            $logs(5);
            expect(jasmine.Ajax.requests.count()).toBe(2);

            $logs.end(true);
            expect(jasmine.Ajax.requests.count()).toBe(3);
            expect(jasmine.Ajax.requests.mostRecent().params).toBe('5');
        });

        it('should not send if url is not defined', function(){
            var $logs = logs({});
            $logs(1);
            $logs(1);
            $logs(1);
            $logs(1);
            $logs.end(true);
            expect(jasmine.Ajax.requests.mostRecent()).not.toBeDefined();
        });

        it('should attempt to post again when first post fails', function(done){
            var $logs = logs({url:'/url', serialize:function(){return 'val';}});
            $logs(1);
            $logs(1);

            // first attempt
            $logs.end(true);
            expect(jasmine.Ajax.requests.count()).toBe(1);

            // second attempt
            jasmine.Ajax.requests.mostRecent().respondWith({ 'status': 404 });
            setTimeout(function(){ // yield for the Promise to finalize
                expect(jasmine.Ajax.requests.count()).toBe(2);
                done();
            });
        });
    });

    describe('serialize', function(){
        it('should serialize correctly', function(){
            expect(buildPost({a:1},{meta:123})).toBe('{"data":{"a":1},"meta":123}');
        });

        describe(': old', function(){
            it('should return not encode logs', function(){
                expect(buildPostOld([{a:1}])).toBe('json=[{"a":1}]');
            });

            it('should encode meta', function(){
                expect(buildPostOld([], {'a b':'c?%d'})).toBe('json=[]&a+b=c%3F%25d');
            });
        });
    });

});


