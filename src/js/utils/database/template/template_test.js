define(['./templateModule'], function(){

	describe('templateFilter', function(){
		var filter;

		beforeEach(module('template'));
		beforeEach(inject(function(templateFilter){
			filter = function(a){
				return templateFilter(a, {page:{test:432},dunk:234});
			};
		}));

		it('should support a context object', inject(function(templateDefaultContext){
			templateDefaultContext.defaultContext = 432;
			expect(filter('<%= defaultContext %>')).toBe('432');
		}));

		it('should support a context object', function(){
			expect(filter('<%= page.test %>')).toBe('432');
			expect(filter('<%= dunk %>')).toBe('234');
		});



		it('should return an empty string and log a message if an error is encountered', inject(function($log){
			expect(filter('<%= pages.pageTests %>')).toBe('');
			expect($log.error.logs.length).toBe(1);
		}));
	});

	describe('templateObj', function(){
		var template;

		beforeEach(module('template'));
		beforeEach(inject(function(templateObj){
			template = function(a, options){
				return templateObj(a, {page:{test:432},dunk:234}, options);
			};
		}));

		it('should expand templates within the object', function(){
			var obj = {test:'<%= page.test %>', other:'<%= dunk %>'};
			expect(template(obj).test).toBe('432');
			expect(template(obj).other).toBe('234');
		});

		it('should not overwrite non strings', function(){
			var obj = {test:[], other:{}, sl: function(){}};
			expect(function(){template(obj);}).not.toThrow();
		});


		it('should deep expand all objects & arrays', function(){
			var obj = {arr:['<%= page.test %>'], obj:{a:'<%= dunk %>'}};
			var res = template(obj);
			expect(res.obj.a).toBe('234');
			expect(res.arr[0]).toBe('432');
		});

		it('should not expand objects in options.exclude', function(){
			var obj = {arr:['<%= page.test %>'], obj:{a:'<%= dunk %>'}};
			var res = template(obj, {skip:['arr','obj']});
			expect(res.obj.a).not.toBe('234');
			expect(res.arr[0]).not.toBe('432');
		});
	});

});