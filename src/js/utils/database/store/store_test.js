define(['../databaseModule'],function(){

	describe('database Store',function(){

		var store;

		beforeEach(module('database'));

		beforeEach(inject(function(DatabaseStore){
			store = new DatabaseStore();
		}));

		it('should instantiate a store object', function(){
			expect(store.store).toEqual({});
		});

		it('should support creating a collection', inject(function(Collection){
			// create instiates an empty array
			store.create('nameSpace');
			expect(store.store.nameSpace).toEqual(jasmine.any(Collection));
			expect(store.store.nameSpace.length).toBe(0);
			expect(store.store.nameSpace.namespace).toBe("nameSpace");
		}));

		it('should throw an error if trying to recreate an existing nameSpace', function(){
			store.create('nameSpace');
			expect(function(){
				store.create('nameSpace');
			}).toThrow();
		});

		it('should support read', function(){
			store.store = {
				nameSpace: "content"
			};
			expect(store.read('nameSpace')).toBe("content");
		});

		it('should throw an error if trying to read a non existing nameSpace', function(){
			expect(function(){
				store.read('nameSpace');
			}).toThrow();
		});


		it('should support update (with both object and array notations)', inject(function(Collection){
			var coll = new Collection();
			store.store = {
				nameSpace: coll
			};

			store.update('nameSpace', 1);
			expect(coll.length).toBe(1);
			expect(coll.at(0)).toBe(1);

			store.update('nameSpace', [2,3]);
			expect(coll.length).toBe(3);
			expect(coll.at(2)).toBe(3);
		}));

		it('should support del', function(){
			store.store = {
				nameSpace: []
			};

			store.del('nameSpace');
			expect(store.store.nameSpace).toBeFalsy();
		});
	});
});