define(['../databaseModule'], function(){
	var
		rand,
		resultObj = {}, // we use this to verify that the correct object is indeed returned
		randomSpy = jasmine.createSpy("random").andReturn(resultObj),
		exRandomSpy = jasmine.createSpy("exRandom").andReturn([2,1,0]);

	describe('database Randomizer', function(){
		beforeEach(module('database'));

		beforeEach(module(function($provide){
			$provide.value("randomizeInt", randomSpy);
			$provide.value("randomizeRange", exRandomSpy);
		}));

		beforeEach(inject(function(DatabaseRandomizer){
			randomSpy.reset();
			exRandomSpy.reset();
			rand = new DatabaseRandomizer();
		}));

		describe(': random', function(){
			it('should return the result of the random generator', function(){
				var result = rand.random();
				expect(result).toBe(resultObj);
			});

			it('should randomize each time it is called', function(){
				rand.random();
				rand.random();
				expect(randomSpy.callCount).toBe(2);
			});

			it('should not randomize when repeat is true', function(){
				rand.random(null, "seed", false);
				rand.random(null, "seed", true);
				expect(randomSpy.callCount).toBe(1);
			});

			it('should randomize when repeat is true, if the seed was not created yet', function(){
				rand.random(null, "seed", true);
				expect(randomSpy.callCount).toBe(1);
			});

			it('should randomize seperately for each seed', function(){
				rand.random(null, "seed1", true);
				rand.random(null, "seed2", true);
				expect(randomSpy.callCount).toBe(2);
			});
		});

		describe(': sequential', function(){
			it('should return the next number', function(){
				expect(rand.sequential(3, "seed")).toBe(0);
				expect(rand.sequential(3, "seed")).toBe(1);
			});

			it('should return the current number if repeat = true', function(){
				expect(rand.sequential(3, "seed", false)).toBe(0);
				expect(rand.sequential(3, "seed", true)).toBe(0);
			});

			it('should repeat when exceeding length', function(){
				expect(rand.sequential(2, "seed")).toBe(0);
				expect(rand.sequential(2, "seed")).toBe(1);
				expect(rand.sequential(2, "seed")).toBe(0);
			});

			it('should allow multiple seeds', function(){
				expect(rand.sequential(2, "seed1")).toBe(0);
				expect(rand.sequential(2, "seed2")).toBe(0);
				expect(rand.sequential(2, "seed1")).toBe(1);
			});

			it('should go bannans if the length does not fit the collection', function(){
				expect(function(){
					rand.sequential(3, "seed");
					rand.sequential(4, "seed");
				}).toThrow();
			});
		});

		describe(': exRandom', function(){
			it('should return the next number', function(){
				expect(rand.exRandom(3, "seed")).toBe(2);
				expect(rand.exRandom(3, "seed")).toBe(1);
			});

			it('should return the current number if repeat = true', function(){
				expect(rand.exRandom(3, "seed", false)).toBe(2);
				expect(rand.exRandom(3, "seed", true)).toBe(2);
			});

			it('should re-randomize when exceeding length', function(){
				rand.exRandom(3, "seed");
				rand.exRandom(3, "seed");
				rand.exRandom(3, "seed");
				rand.exRandom(3, "seed");
				expect(exRandomSpy.callCount).toBe(2);
			});

			it('should allow multiple seeds', function(){
				rand.exRandom(3, "seed1");
				rand.exRandom(3, "seed2");
				expect(exRandomSpy.callCount).toBe(2);
			});

			it('should go bannans if the length does not fit the collection', function(){
				expect(function(){
					rand.exRandom(3, "seed");
					rand.exRandom(4, "seed");
				}).toThrow();
			});
		});
	});
});