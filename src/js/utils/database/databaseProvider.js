define(function(require){
	var _ = require('underscore');

	DatabaseProvider.$inject = ['DatabaseStore', 'DatabaseRandomizer', 'databaseInflate', 'templateObj', 'databaseSequence'];
	function DatabaseProvider(Store, Randomizer, inflate, templateObj, DatabaseSequence){

		function Database(){
			this.store = new Store();
			this.randomizer = new Randomizer();
		}

		_.extend(Database.prototype, {
			createColl: function(namespace){
				this.store.create(namespace);
			},

			getColl: function(namespace){
				return this.store.read(namespace);
			},

			add: function(namespace, query){
				var coll = this.store.read(namespace);
				coll.add(query);
			},

			inflate: function(namespace, query, context){
				var coll = this.getColl(namespace);

				// inflate
				if (!query.$inflated || query.reinflate) {
					query.$inflated = inflate(query, coll, this.randomizer);
				}

				// interpolate
				if (!query.$templated || query.regenerateTemplate){
					context[namespace + 'Data'] = query.$inflated.data || {};
					context[namespace + 'Meta'] = query.$meta;
					query.$templated = templateObj(query.$inflated, context);
				}

				return query.$templated;
			},

			sequence: function(namespace, arr){
				if (!_.isArray(arr)){
					throw new Error('Sequence must be an array.');
				}
				return new DatabaseSequence(namespace, arr, this);
			}
		});

		return Database;
	}

	return DatabaseProvider;
});