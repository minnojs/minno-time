import poster from './poster';
import transformLogs from './transformLogs';
import global from '../../global';

export default createLogs;

function createLogs($logs, settings){
    var $sink = $logs.map(applyMap(settings.logger || settings.transformLogs || transformLogs));
    $sink.map(function(log){
        global().current.logs.push(log);
    });

    poster($sink, settings);
    if (settings.poster) settings.poster($sink, settings);

    return $sink;

    // $logs is a stream of array, we want to apply them as args to the transform function
    function applyMap(fn){
        return function(args){ return fn.apply(null,args); };
    }
}
