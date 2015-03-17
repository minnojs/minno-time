define(['underscore'],function(_){

	// @TODO: repeat currently repeats only the last element, we need repeat = 'set' or something in order to prevent re-randomizing of exRandom...

	RandomizerProvider.$inject = ['randomizeInt', 'randomizeRange', 'Collection'];
	function RandomizerProvider(randomizeInt, randomizeRange, Collection){

		function Randomizer(){
			this._cache = {
				random : {},
				exRandom : {},
				sequential : {}
			};
		}

		_.extend(Randomizer.prototype, {
			random: random,
			exRandom: exRandom,
			sequential: sequential
		});

		return Randomizer;

		function random(length, seed, repeat){
			var cache  = this._cache.random;

			if (repeat && !_.isUndefined(cache[seed])) {
				return cache[seed];
			}

			// save result in cache
			cache[seed] = randomizeInt(length);

			return cache[seed];
		}

		function sequential(length, seed, repeat){
			var cache = this._cache.sequential;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(_.range(length));
				return coll.first();
			}

			if (coll.length !== length){
				throw new Error("This seed  ("+ seed +") points to a collection with the wrong length, you can only use a seed for sets of the same length");
			}

			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			}

			// if we've reached the end
			result = coll.next();

			// if we've reached the end of the collection (next)
			if (_.isUndefined(result)){
				return coll.first();
			} else {
				return result;
			}
		}

		function exRandom(length, seed, repeat){
			var cache = this._cache.exRandom;
			var coll = cache[seed];
			var result;

			// if needed create collection and set it in seed
			if (_.isUndefined(coll)){
				coll = cache[seed] = new Collection(randomizeRange(length));
				return coll.first();
			}

			if (coll.length !== length){
				throw new Error("This seed  ("+ seed +") points to a collection with the wrong length, you can only use a seed for sets of the same length");
			}

			// if this is a repeated element:
			if (repeat) {
				return coll.current();
			}

			// if we've reached the end
			result = coll.next();

			// if we've reached the end of the collection (next)
			// we should re-randomize
			if (_.isUndefined(result)){
				coll = cache[seed] = new Collection(randomizeRange(length));
				return coll.first();
			} else {
				return result;
			}
		}

	}

	return RandomizerProvider;

});