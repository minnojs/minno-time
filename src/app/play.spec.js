import {composeLoggerSettings} from './playPhase';

describe('play', function(){
    describe('loggerSettings', function(){
        it('should add taskName', function(){
            var settings = composeLoggerSettings({name:123}, {});
            expect(settings.metaData.taskName).toBe(123);
        });

        it('should merge settings.metaData', function(){
            var settings = composeLoggerSettings({settings:{logger:{metaData:{a:1}}}}, {});
            expect(settings.metaData.a).toBe(1);
        });

        it('should merge global.$meta', function(){
            var settings = composeLoggerSettings({}, {$meta:{b:2}});
            expect(settings.metaData.b).toBe(2);
        });
    });
});
