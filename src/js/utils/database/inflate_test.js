define(['./databaseModule'],function(){

	describe('database inflate',function(){

		var inflate,
			result,
			querySpy = jasmine.createSpy('query');

		beforeEach(module('database', function($provide){
			$provide.value('databaseQuery', querySpy);
		}));

		beforeEach(inject(function(databaseInflate, Collection){
			// any inherit = true will sequentialy inherit the objects in collection
			inflate = function(source, collection){
				var coll = new Collection(collection || []);
				querySpy.andCallFake(function(){return coll.next();});
				result = databaseInflate(source, coll, null);
			};
		}));

		it('should be fine when there is no inheritance', function(){
			inflate({});
			expect(result).toEqual({});
		});

		it('should throw an error ', function(){
			inflate({});
			expect(result).toEqual({});
		});

		it('should run obj.customize function when there is no inheritance', inject(function($rootScope){
			var global = {global:'obj'};
			var spy = jasmine.createSpy('customize');
			var source = {customize:spy};
			$rootScope.global = global;
			inflate(source);
			expect(spy).toHaveBeenCalledWith(source,global);
		}));

		it('should run obj.customize function when there is no more inheritance', inject(function($rootScope){
			var spy = jasmine.createSpy('customize').andReturn();
			var global = {global:'obj'};
			$rootScope.global = global;
			inflate({inherit:true}, [{customize:spy}]);
			expect(spy).toHaveBeenCalledWith({inherit:true, customize:spy}, global);
		}));

		it('should not run obj.customize function when there is more inheritance', inject(function($rootScope){
			var spy = jasmine.createSpy('customize');
			var unspy = jasmine.createSpy('later customize');
			var global = {global:'obj'};
			$rootScope.global = global;

			inflate({inherit:true, customize:spy}, [{customize:unspy}]);
			expect(spy).toHaveBeenCalledWith({inherit:true, customize:spy}, global);
			expect(unspy).not.toHaveBeenCalled();
		}));

		it('should return a copy, never the source', function(){
			var source;

			// without inheritance
			source = {};
			inflate(source);
			expect(result).not.toBe(source);

			// with inheritance
			source = {inherit:true};
			inflate(source, [{a:1}]);
			expect(result).not.toBe(source);
		});

		it('should recursively extend obj with the objects inherited by obj.inherit', function(){
			inflate({inherit:true}, [
				{a:1, inherit:true},
				{b:1, inherit:true},
				{c:1},
				{d:1}
			]);

			expect(result.a).toBeDefined();
			expect(result.b).toBeDefined();
			expect(result.c).toBeDefined();
			expect(result.d).not.toBeDefined();
		});

		it('should throw an error if depth exceeds 10', function(){
			expect(function(){
				inflate({inherit:true}, [
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{inherit:true},
					{}
				]);
			}).toThrow();

		});

		it('should throw an exception if a query was not found', function(){
			expect(function(){
				inflate({inherit:true}, []);
			}).toThrow();
		});

		it('should inherit keys from the parent', function(){
			var parent = {a:1, b:[1,2], c:{a:1}};
			inflate({inherit:true},[parent]);
			// primitives
			expect(result.a).toBe(parent.a);
			// arrays
			expect(result.b).not.toBe(parent.b);
			expect(result.b).toEqual(parent.b);
			// objects
			expect(result.c).not.toBe(parent.c);
			expect(result.c).toEqual(parent.c);
		});

		it('should not inherit keys that the child has', function(){
			inflate({inherit:true,a:1},[{a:2}]);
			expect(result.a).toBe(1);
		});

		it('should not inherit keys that the child has even when they evaluate to false', function(){
			inflate({inherit:true,a:undefined},[{a:2}]);
			expect(result.a).toBe(undefined);
		});

		describe(': merge', function(){
			it('should merge arrays', function(){
				inflate({inherit:{merge:['a']}, a:[1]},[{a:[2]}]);
				expect(result.a).toEqual([1,2]);
			});

			it('should merge objects', function(){
				inflate({inherit:{merge:['a']}, a:{a:1}},[{a:{b:2}}]);
				expect(result.a).toEqual({a:1,b:2});
			});

			it('should throw if merge is not an array', function(){
				expect(function(){
					inflate({inherit:{merge:'a'}},[{}]);
				}).toThrow();
			});

			it('should throw if parent and child are not of the same type', function(){
				expect(function(){
					inflate({inherit:{merge:'a'}, a:[]},[{a:{}}]);
				}).toThrow();

				expect(function(){
					inflate({inherit:{merge:'a'}, a:{}},[{a:''}]);
				}).toThrow();
			});
		});

		it('should extend data any way (child gets precedence)', function(){
			inflate({inherit:true, data:{a:1}}, [{data:{a:2, b:2}}]);
			expect(result.data.a).toBe(1);
			expect(result.data.b).toBe(2);
		});

	});
});