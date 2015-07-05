define(['underscore', './databaseModule'],function(_){

	describe('Database',function(){

		var db, inflateSpy,	templateSpy, sequenceSpy,
			store = jasmine.createSpyObj('store',['create', 'add','read']);

		beforeEach(module('database', function($provide){
			inflateSpy  = jasmine.createSpy('inflate').andCallFake(function(){return arguments[0];});
			templateSpy = jasmine.createSpy('template').andCallFake(function(){return arguments[0];});
			sequenceSpy = jasmine.createSpy('sequence');

			$provide.value('DatabaseStore', function(){_.extend(this,store);});
			$provide.value('DatabaseRandomizer', function(){});
			$provide.value('databaseInflate', inflateSpy);
			$provide.value('templateObj', templateSpy);
			$provide.value('databaseSequence', sequenceSpy);
		}));

		beforeEach(inject(function(Database){
			db = new Database();
		}));

		it('should create a local store', inject(function(DatabaseStore){
			expect(db.store).toEqual(jasmine.any(DatabaseStore));
		}));

		it('should create a local randomizer', inject(function(DatabaseRandomizer){
			expect(db.randomizer).toEqual(jasmine.any(DatabaseRandomizer));
		}));

		it('should "createColl" a column', function(){
			db.createColl(123);
			expect(store.create).toHaveBeenCalledWith(123);
		});

		it('should "add" data', function(){
			store.add(123);
			expect(store.add).toHaveBeenCalledWith(123);
		});

		// namespace, coll, context
		describe(': inflate', function(){
			// ************** inflate **************
			it('should not inflate if query has been inflated', function(){
				db.inflate('ns', {$inflated:true}, 'context');
				expect(inflateSpy).not.toHaveBeenCalled();
			});

			it('should force inflate if reinflate is true', function(){
				db.inflate('ns', {$inflated:true, reinflate:true}, 'context');
				expect(inflateSpy).toHaveBeenCalled();
			});

			it('should inflate if query has not been inflated', function(){
				var obj = {};
				db.inflate('ns', obj, 'context');
				expect(inflateSpy).toHaveBeenCalledWith(obj,undefined, db.randomizer);
			});

			// ************** template **************
			it('should not template if query has been interpolated', function(){
				db.inflate('ns', {$templated:true}, 'context');
				expect(templateSpy).not.toHaveBeenCalled();
			});

			it('should force template if regenerateTemplate is true', function(){
				db.inflate('ns', {$templated:true, regenerateTemplate:true}, 'context');
				expect(templateSpy).toHaveBeenCalled();
			});

			it('should template if query has not been templated', function(){
				var obj = {data:123};
				db.inflate('ns', obj, 'context');
				expect(templateSpy).toHaveBeenCalledWith(obj.data,'context', undefined);
				expect(templateSpy).toHaveBeenCalledWith(obj.$inflated,'context', undefined);
			});

			it('should extend the context with metaData and elmData', function(){
				var context = {};
				db.inflate('test', {$inflated:{data:123},$meta: 456}, context);
				expect(context.testMeta).toBe(456);
				expect(context.testData).toBe(123);
			});

			// ************** addGlobal, addCurrent **************
			it('should add to global (addGlobal)', function(){
				var context = {global:{}};
				db.inflate('test', {$inflated:{addGlobal:{test:123}}}, context);
				expect(context.global.test).toBe(123);
			});

			it('should add to current (addCurrent)', function(){
				var context = {current:{}};
				db.inflate('test', {$inflated:{addCurrent:{test:123}}}, context);
				expect(context.current.test).toBe(123);
			});
		});

		describe(': sequence', function(){
			it('should create a sequence from an array', inject(function(databaseSequence){
				var arr = [];
				var seq = db.sequence('test', arr);
				expect(sequenceSpy).toHaveBeenCalledWith('test',arr,db);
				expect(seq instanceof databaseSequence).toBe(true);
			}));
		});
	});

	describe('Sequence', function(){
		var db, sequence, create;

		beforeEach(module('database'));

		beforeEach(inject(function(databaseSequence){
			db = {
				inflate:jasmine.createSpy('inflate').andCallFake(function(namespace, obj){return obj;})
			};

			create = function(arr){
				/*jshint newcap: false */
				return (sequence = new databaseSequence('test', arr, db));
				/*jshint newcap: true */
			};
		}));

		it('should return not truthy when no elements are found', function(){
			create([]).next();
			expect(sequence.current()).not.toBeDefined();
		});

		it('should inflate the objects', function(){
			var context = {context:1};
			var obj = {obj:2};
			create([obj]).next().current(context);
			expect(db.inflate).toHaveBeenCalledWith('test', obj, context, undefined);
		});

		it('should support next/prev', function(){
			create([{test:1},{test:2},{test:3}]).next();
			expect(sequence.current().test).toBe(1);
			sequence.next().next();
			expect(sequence.current().test).toBe(3);
			sequence.prev();
			expect(sequence.current().test).toBe(2);
		});

		it('should support "all"', function(){
			var arr = [{},{},{}];
			create(arr);
			var res = sequence.all();

			for (var i = 0; i < arr.length; i++){
				expect(arr[i]).toBe(res[i]);
			}
		});
	});
});