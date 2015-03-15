define(function(require){
	return require('./templateObjProvider')(
		// $filter('template')
		function(){
			return require('./templateFilter')(console, {}); // $log, defaultContext
		}
	);

});