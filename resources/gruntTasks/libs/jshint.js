var hint = require('jshint/src/cli');

function jshint(files, options){
	var results;

	hint.run({
		args:files,
		config: options,
		reporter: function(res){
			results = res;
		}
	});

	return results;
}

module.exports = jshint;