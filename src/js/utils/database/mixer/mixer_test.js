define(['underscore','./mixerModule', '../randomize/randomizeModuleMock'],function(){

	describe('Mixer', function(){
		var mixer;
		describe('mixer', function(){
			beforeEach(module('mixer','randomizeMock'));

			beforeEach(inject(function(_mixer_){
				mixer = _mixer_;
			}));

			it('should return any non mixer object as is', function(){
				expect(mixer(123)).toEqual([123]);
				expect(mixer([])).toEqual([[]]);
				expect(mixer({a:345})).toEqual([{a:345}]);
			});

			it('should throw an error if an unknow mixer is used', function(){
				expect(function(){
					mixer({mixer:'unknow'});
				}).toThrow();
			});

			it('should throw an error if an undefined mixer is used', function(){
				expect(function(){
					mixer({mixer:undefined});
				}).toThrow();
			});

			it('should keep the results in the mixer object `$parsed`', function(){
				var testArr = [];
				mixer.mixers.testFn = function(){return testArr;};
				var mixerObj = {mixer:'testFn'};

				expect(mixer(mixerObj)).toBe(testArr);
				expect(mixerObj.$parsed).toBe(testArr);
			});

			it('should return `$parsed` unless remix = true', function(){
				mixer.mixers.testFn = function(){return 456;};

				expect(mixer({mixer:'testFn', $parsed:123})).toBe(123);
				expect(mixer({mixer:'testFn', $parsed:123, remix:true})).toBe(456);
			});

			it('should repeat any data in a repeat n times', function(){
				expect(mixer({
					mixer:'repeat',
					times:'2',
					data: [1,2]
				})).toEqual([1,2,1,2]);
			});

			it('should return the data in a wrapper as is', function(){
				expect(mixer({
					mixer:'wrapper',
					data: [1,2]
				})).toEqual([1,2]);
			});

			describe(': random', function(){
				it('should return the data in a random element randomized', function(){
					expect(mixer({
						mixer:'random',
						data: [1,2,3]
					})).toEqual([3,2,1]);
				});

				it('should mix all elements before randomizing', function(){
					expect(mixer({
						mixer:'random',
						data: [1,2,{mixer:'repeat', times:2, data:[3]}]
					})).toEqual([3, 3,2,1]);
				});

				it('should not mix wrappers', function(){
					var wrapper = {mixer:'wrapper', data:[3,4]};
					expect(mixer({
						mixer:'random',
						data: [1,2,wrapper]
					})).toEqual([wrapper,2,1]);
				});

				it('should recursively mix (real use case)', function(){
					expect(mixer({
						mixer:'random',
						data: [0,{mixer:'repeat', times:2, data:[1,2]},3]
					})).toEqual([3,2, 1,2,1,0]);

				});

			});


			it('should choose n || 1 random elements', function(){
				expect(mixer({
					mixer:'choose',
					data: [1,2,3,4]
				})).toEqual([4]);

				expect(mixer({
					mixer:'choose',
					n: 2,
					data: [1,2,3,4]
				})).toEqual([4,3]);
			});

			it('should know how to weightedRandom', inject(function(randomizeSettings){
				randomizeSettings.random = 0.5;
				expect(mixer({
					mixer:'weightedRandom',
					weights: [0.2, 0.8],
					data: [1,2]
				})).toEqual([2]);

				randomizeSettings.random = 0.1;
				expect(mixer({
					mixer:'weightedRandom',
					weights: [0.2, 0.8],
					data: [1,2]
				})).toEqual([1]);

				randomizeSettings.random = 0.9;
				expect(mixer({
					mixer:'weightedRandom',
					weights: [0.2, 0.6, 0.2],
					data: [1,2, 3]
				})).toEqual([3]);
			}));
		});


		describe(': mixerSequenceProvider', function(){
			var sequence, Sequence;

			function create(arr){return (sequence = new Sequence(arr));}
			function expect_current(){return expect(sequence.current().test);}

			beforeEach(module('mixer','randomizeMock'));
			beforeEach(inject(function(MixerSequence){
				Sequence = MixerSequence;
			}));

			it('should return plain elements', function(){
				create([{test:1}]).next();
				expect_current().toBe(1);
			});

			it('should evaluate mixers', function(){
				create([{mixer:'wrapper', data:[{test:1}]}]).next();
				expect_current().toBe(1);
			});

			it('should evaluate nested mixers', function(){
				create([
					{mixer:'wrapper', data:[
						{mixer:'wrapper', data:[
							{test:1}
						]}
					]}
				]).next();
				expect_current().toBe(1);
			});

			it('should support (nested) going back', function(){
				create([
					{test:0},
					{mixer:'wrapper', data:[
						{mixer:'wrapper', data:[
							{test:1},{test:2}
						]},
						{test:3}
					]},
					{test:4}
				]).next().next().next().next().next();
				expect_current().toBe(4);
				sequence.prev();
				expect_current().toBe(3);
				sequence.prev();
				expect_current().toBe(2);
				sequence.prev();
				expect_current().toBe(1);
				sequence.prev();
				expect_current().toBe(0);
			});

			it('should remix when needed', function(){
				var context = {global:{flag:true}};

				create([
					{
						mixer:'branch',
						conditions:[{compare: 'global.flag',to:true}],
						data:[{test:1}],
						elseData: [{test:2}]
					},
					{
						mixer:'branch',
						remix:true,
						conditions:[{compare: 'global.flag',to:true}],
						data:[{test:3}],
						elseData: [{test:4}]
					}
				]);

				sequence.next(context);
				expect_current().toBe(1);
				sequence.next(context);
				expect_current().toBe(3);

				context.global.flag = false;
				sequence.prev(context);
				expect_current().toBe(1);
				sequence.next(context);
				expect_current().toBe(4);
			});

			it('should return undefined when the sequence is done', function(){
				create([{}]).next().next();
				expect(sequence.current()).not.toBeDefined();
			});

			it('should allow going back after a sequence is finished', function(){
				create([{}]).next().next().prev();
				expect(sequence.current()).toBeDefined();
			});

			it('should mark the elements with $meta', function(){
				var meta;
				create([{mixer:'wrapper',data:[{},{}]},{}]).next();

				meta = sequence.current().$meta;
				expect(meta.number).toBe(1);
				expect(meta.outOf).toBe(3);

				meta = sequence.next().next().current().$meta;
				expect(meta.number).toBe(3);
				expect(meta.outOf).toBe(2); // this is an error but is what the AI knows to do at this time...
			});

		});

		describe(': mixerSequential', function(){
			var mix;
			var context = {};
			var mix1 = {mixer:1};
			var mix2 = {mixer:2};
			var mix3 = {mixer:3};
			var mixerSpy = jasmine.createSpy('mixer').andCallFake(function(a){
				if (a == mix1){
					return ['a','b'];
				}
				if (a == mix2){
					return [mix1,1];
				}
				if (a == mix3){
					return [mix3];
				}
			});

			beforeEach(module('mixer',function($provide){
				$provide.value('mixer', mixerSpy);
			}));

			beforeEach(inject(function(mixerSequential){
				mix = mixerSequential;
				mixerSpy.reset();
			}));

			it('should mix the first element', function(){
				mix([mix1], context);
				expect(mixerSpy).toHaveBeenCalledWith(mix1, context);
			});

			it('should replace first element with the mixed array', function(){
				expect(mix([mix1,2])).toEqual(['a','b',2]);
			});

			it('should mix recursively', function(){
				expect(mix([mix2, 2])).toEqual(['a','b',1,2]);
			});

			it('should break recursion when mixerDepth is reached', function(){
				expect(function(){
					mix([mix3]);
				}).toThrow('Mixer: the mixer allows a maximum depth of 10');
			});

			it('should pass context to the mixer', function(){
				mix([mix1],context);
				expect(mixerSpy).toHaveBeenCalledWith(mix1,context);
			});
		});

		describe(': mixerRecursive', function(){
			var mix;
			var context = {};
			var mix1 = {mixer:1};
			var mix2 = {mixer:2};
			var mix3 = {mixer:3};
			var mixerSpy = jasmine.createSpy('mixer').andCallFake(function(a){
				if (a == mix1){
					return ['a','b'];
				}
				if (a == mix2){
					return [mix1,1];
				}
				if (a == mix3){
					return [mix3];
				}
			});

			beforeEach(module('mixer',function($provide){
				$provide.value('mixer', mixerSpy);
			}));

			beforeEach(inject(function(mixerRecursive){
				mix = mixerRecursive;
				mixerSpy.reset();
			}));

			it('should replace all elements with the mixed array', function(){
				expect(mix([mix1,3,mix1])).toEqual(['a','b',3, 'a','b']);
			});

			it('should mix recursively', function(){
				expect(mix([3, mix2])).toEqual([3, 'a','b',1]);
			});

			it('should break recursion when mixerDepth is reached', function(){
				expect(function(){
					mix([mix3]);
				}).toThrow('Mixer: the mixer allows a maximum depth of 10');
			});

			it('should pass context to the mixer', function(){
				mix([mix1],context);
				expect(mixerSpy).toHaveBeenCalledWith(mix1,context);
			});

		});

		describe(': branching', function(){
			beforeEach(module('mixer'));

			describe('mixerDotNotation', function(){
				var dn;

				beforeEach(inject(function(mixerDotNotation){
					dn = mixerDotNotation;
				}));

				it('should return chain if it is not a string', function(){
					var obj = {}, arr = [], str = 132.2156;
					expect(dn(str, {global:null})).toBe(str);
					expect(dn(obj, {global:null})).toBe(obj);
					expect(dn(arr, {global:null})).toBe(arr);
				});

				it('should return the chain if no dots are present', function(){
					expect(dn("global", {global:null})).toBe('global');
				});

				it('should ignore escaped dots in a literal chain', function(){
					expect(dn("global/.boing", {global:null})).toBe('global.boing');
				});

				it('should use dotNotation to resolve any other strings', function(){
					expect(dn("global.1", {global:[1,234,3]})).toBe(234);
				});
			});

			describe('mixerCondition', function(){
				var mc;
				var context = {
					global: {
						123 : 123,
						234 : 234
					},
					local: {
						56: 56,
						78: 78
					}
				};

				beforeEach(inject(function(mixerCondition){
					mc = function(condition){
						return mixerCondition(condition, context);
					};
				}));

				it('should compare two objects', function(){
					expect(mc({
						compare: [1,3,4],
						to: [1,3,4]
					})).toBeTruthy();
					expect(mc({
						compare: [1,3,4],
						to: [1,3]
					})).not.toBeTruthy();
				});

				it('should compare using dotNotations', function(){
					expect(mc({
						compare: 123,
						to: 'global.123'
					})).toBeTruthy();
					expect(mc({
						compare: 'local.56',
						to: 231
					})).not.toBeTruthy();
				});

				it('should check for truthiness if "to" is not set', function(){
					expect(mc({compare:2})).toBeTruthy();
					expect(mc({compare:'local.a'})).not.toBeTruthy();
				});

				it('should support an operator function', function(){
					var opSpy = jasmine.createSpy('operator').andCallFake(function(){return true;});
					expect(mc({
						compare: 1,
						to : 2,
						operator: opSpy
					})).toBeTruthy();

					expect(opSpy).toHaveBeenCalledWith(1,2, context);
				});

				it('should support the whole condition as a function', function(){
					var opSpy = jasmine.createSpy('operator').andCallFake(function(){return true;});
					expect(mc(opSpy)).toBeTruthy();

					expect(opSpy).toHaveBeenCalledWith(undefined,undefined, context);
				});

				it('should support greaterThan', function(){
					expect(mc({compare:2,to:2,operator:'greaterThan'})).not.toBeTruthy();
					expect(mc({compare:2,to:1,operator:'greaterThan'})).toBeTruthy();
					expect(mc({compare:1,to:2,operator:'greaterThan'})).not.toBeTruthy();

					expect(mc({compare:1,to:"ymu",operator:'greaterThan'})).not.toBeTruthy();
					expect(mc({compare:1,to:[],operator:'greaterThan'})).not.toBeTruthy();
					expect(mc({compare:1,to:[2],operator:'greaterThan'})).not.toBeTruthy();
				});

				it('should support greaterThanOrEqual', function(){
					expect(mc({compare:2,to:2,operator:'greaterThanOrEqual'})).toBeTruthy();
					expect(mc({compare:2,to:1,operator:'greaterThanOrEqual'})).toBeTruthy();
					expect(mc({compare:1,to:2,operator:'greaterThanOrEqual'})).not.toBeTruthy();

					expect(mc({compare:1,to:"ymu",operator:'greaterThanOrEqual'})).not.toBeTruthy();
					expect(mc({compare:1,to:[],operator:'greaterThanOrEqual'})).not.toBeTruthy();
					expect(mc({compare:1,to:[2],operator:'greaterThanOrEqual'})).not.toBeTruthy();
				});

				it('should support exactly', function(){
					var obj = {};
					expect(mc({compare:obj, to:obj, operator:'exactly'})).toBeTruthy();
					expect(mc({compare:{}, to:{}, operator:'exactly'})).not.toBeTruthy();
				});

				it('should support in', function(){
					expect(mc({compare:1, to:[1,2,3], operator:'in'})).toBeTruthy();
					expect(mc({compare:4, to:[1,2,3], operator:'in'})).not.toBeTruthy();

					expect(mc({compare:4, to: 234, operator:'in'})).not.toBeTruthy();
				});
			});

			describe(': evaluate', function(){
				var evaluate;

				beforeEach(module(function($provide){
					$provide.value('mixerCondition', function(a){return !!a;});
				}));
				beforeEach(inject(function(mixerEvaluate){
					evaluate = mixerEvaluate;
				}));

				it('should support AND', function(){
					expect(evaluate({and:[1,2,3,4]})).toBeTruthy();
					expect(evaluate({and:[1,2,0,4]})).not.toBeTruthy();
				});

				it('should support NAND', function(){
					expect(evaluate({nand:[1,2,3,4]})).not.toBeTruthy();
					expect(evaluate({nand:[1,2,0,4]})).toBeTruthy();
				});

				it('should treat arrays as &&', function(){
					expect(evaluate([1,2,3,4])).toBeTruthy();
					expect(evaluate([1,2,0,4])).not.toBeTruthy();
				});

				it('should support OR', function(){
					expect(evaluate({or:[1,0,0,0]})).toBeTruthy();
					expect(evaluate({or:[0,0,0,0]})).not.toBeTruthy();
				});

				it('should support NOR', function(){
					expect(evaluate({nor:[1,0,0,0]})).not.toBeTruthy();
					expect(evaluate({nor:[0,0,0,0]})).toBeTruthy();
				});

				it('should support nested operators', function(){
					expect(evaluate([{and:[1,1,{or:[0,0]}]}])).not.toBeTruthy();
					expect(evaluate([
						{and:[1,1,{or:[0,0]}]},
						{nor:[1,1,1, {and:[1,1]}]}
					])).not.toBeTruthy();
				});
			});

			describe(': branch', function(){
				var mixer;
				beforeEach(inject(function(_mixer_){
					mixer = _mixer_;
				}));

				it('should support the branching mixers', function(){
					expect(mixer.mixers.branch).toBeDefined();
					expect(mixer.mixers.multiBranch).toBeDefined();
				});

				it('should work', function(){
					expect(mixer({
						mixer:'branch',
						conditions: [{compare:'global.1',to:2}],
						data: [4,5,6]
					}, {global:[1,2,3]})).toEqual([4,5,6]);
				});

				it('should support the defaultContext', inject(function(mixerDefaultContext){
					mixerDefaultContext.global = [1,2,3];
					expect(mixer({
						mixer:'branch',
						conditions: [{compare:'global.1',to:2}],
						data: [4,5,6]
					})).toEqual([4,5,6]);

					delete(mixerDefaultContext.global);
				}));

				it('should support elseData', function(){
					expect(mixer({
						mixer:'branch',
						conditions: [{compare:'global.2',to:2}],
						elseData: [7,8,9]
					}, {global:[1,2,3]})).toEqual([7,8,9]);
				});
			});

			describe(': multiBranch', function(){
				var mixer;
				beforeEach(inject(function(_mixer_){
					mixer = _mixer_;
				}));

				it('should work', function(){
					expect(mixer({
						mixer:'multiBranch',
						branches:[
							{conditions:[{}]}, //always false
							{conditions: [{compare:'global.1',to:2}],data: "true"},
							{conditions: [{compare:'global.1',to:2}],data: "false"},
							{}
						],
						elseData: "else"
					}, {global:[1,2,3]})).toEqual("true");
				});

				it('should support the defaultContext', inject(function(mixerDefaultContext){
					mixerDefaultContext.global = [1,2,3];
					expect(mixer({
						mixer:'multiBranch',
						branches:[
							{conditions:[{}]}, //always false
							{conditions: [{compare:'global.1',to:2}],data: "true"},
							{conditions: [{compare:'global.1',to:2}],data: "false"},
							{}
						],
						elseData: "else"
					})).toEqual("true");

					delete(mixerDefaultContext.global);
				}));


				it('should support elseData', function(){
					expect(mixer({
						mixer:'multiBranch',
						branches:[
							{conditions:[{}]}, //always false
							{conditions: [{compare:'global.1',to:2}],data: "false"},
							{conditions: [{compare:'global.1',to:2}],data: "false"},
							{conditions:[{}]} //always false
						],
						elseData: "else"
					}, {global:[]})).toEqual("else");
				});

			});



		});
	});


});