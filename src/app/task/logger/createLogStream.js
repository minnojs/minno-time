import poster from './poster';
import transformLogs from './transformLogs';

export default createLogs;

function createLogs($sourceLogs, settings){
    var $logs = $sourceLogs.map(applyMap(settings.logger || settings.transformLogs || transformLogs));

    if (settings.poster) settings.poster($logs, settings, poster);
    else poster($logs, settings);

    return $logs;

    // $logs is a stream of array, we want to apply them as args to the transform function
    function applyMap(fn){
        return function(args){ return fn.apply(null,args); };
    }
}
