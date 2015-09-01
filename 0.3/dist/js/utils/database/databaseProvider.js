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

			inflate: function(namespace, query, context, options){
				var coll = this.getColl(namespace);
				var result;

				// inherit
				if (!query.$inflated || query.reinflate) {
					query.$inflated = inflate(query, coll, this.randomizer);
				}

				// template
				if (!query.$templated || query.regenerateTemplate){
					context[namespace + 'Meta'] = query.$meta;
					context[namespace + 'Data'] = templateObj(query.$inflated.data || {}, context, options); // make sure we support
					query.$templated = templateObj(query.$inflated, context, options);
				}

				result = query.$templated;

				// set flags
				if (context.global && result.addGlobal){
					_.extend(context.global, result.addGlobal);
				}

				if (context.current && result.addCurrent){
					_.extend(context.current, result.addCurrent);
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