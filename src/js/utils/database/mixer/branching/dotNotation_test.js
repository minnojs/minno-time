define(['angular', './dotNotation'], function(angular,dotNotationProvider){

	// setup module for testing;
	angular.module('dotNotationModule',[]).value('dotNotation',dotNotationProvider);

	describe('dotNotation', function(){
		var dn;
		var parent = {
			child1: {},
			child2: {
				grandChild: {}
			},
			arrChild: [
				{child:{}},
				[{}]
			]
		};
		beforeEach(module('dotNotationModule'));
		beforeEach(inject(function(dotNotation){
			dn = function(chain, opts){
				return dotNotation(chain,parent, opts);
			};
		}));

		it('should return undefined if target is not found', function(){
			expect(dn('boing')).toBeUndefined();
		});

		it('should return a child', function(){
			expect(dn('child1')).toBe(parent.child1);
		});

		it('should return a grandChild', function(){
			expect(dn('child2.grandChild')).toBe(parent.child2.grandChild);
		});

		it('should return array members with dot notation', function(){
			expect(dn('arrChild.0')).toBe(parent.arrChild[0]);
			expect(dn('arrChild.1.0')).toBe(parent.arrChild[1][0]);
		});

		// it('should return array members with [] notation', function(){
		//	expect(dn('arrChild[0]')).toBe(parent.arrChild[0]);
		//	expect(dn('arrChild[1][0]')).toBe(parent.arrChild[1][0]);
		// });
	});
});