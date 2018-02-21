export default createLogs;

function createLogs($sourceLogs, settings, defaultLogMap){
    var logMap = settings.logger || settings.logMap || defaultLogMap;
    return  $sourceLogs.map(applyMap(logMap));

    // $logs is a stream of arrays, we want to apply them as args to the transform function
    function applyMap(fn){
        return function(args){ return fn.apply(null,args); };
    }
}
