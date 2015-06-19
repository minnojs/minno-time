/*
 *	The store is a collection of collection devided into namespaces.
 *	You can think of every namespace/collection as a table.
 */
define(['underscore'],function(_){

	storeProvider.$inject = ['Collection'];
	function storeProvider(Collection){

		function Store(){
			this.store = {};
		}

		_.extend(Store.prototype, {
			create: function create(nameSpace){
				if (this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' already exists');
				}
				this.store[nameSpace] = new Collection();
				this.store[nameSpace].namespace = nameSpace;
			},

			read: function read(nameSpace){
				if (!this.store[nameSpace]){
					throw new Error('The name space ' + nameSpace + ' does not exist');
				}
				return this.store[nameSpace];
			},

			update: function update(nameSpace, data){
				var coll = this.read(nameSpace);
				coll.add(data);
			},

			del: function del(nameSpace){
				this.store[nameSpace] = undefined;
			}
		});

		return Store;
	}

	return storeProvider;
});