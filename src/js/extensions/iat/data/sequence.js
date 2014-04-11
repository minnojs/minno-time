define(['./properties'],function(properties){

	/**
	 * Takes a sequence array and pushes in a block according to the settings in blockObj:
	 * {
	 *  part: 1,
	 *  block: 1,
	 *  twoRows: false,
	 *  trials: 20
	 * }
	 *
	 * Clarification: blocks are the order of the blocks. parts are the type of block...
	 */

	var addBlock = function addBlock(sequenceArr, blockObj){

		// push instructions
		sequenceArr.push({
			data: {part:blockObj.part, block:blockObj.block, IATversion:properties.IATversion, blockStart:true},
			inherit: {set:'instructions', type:'byData', data: {block:blockObj.block}}
		});

		// push block trials
		sequenceArr.push({
			mixer : 'repeat',
			times : !blockObj.twoRows ? blockObj.trials : Math.floor(blockObj.trials/2),
			data : !blockObj.twoRows ?
				// if we have one row
				[
					{inherit : {type:'byData', data:{part:blockObj.part}, set:'IAT'}, data: {block:blockObj.block}}
				]
				// if we have two rows
				: [
					{inherit : {type:'byData', data:{part:blockObj.part,row:1}, set:'IAT'}, data: {block:blockObj.block}},
					{inherit : {type:'byData', data:{part:blockObj.part,row:2}, set:'IAT'}, data: {block:blockObj.block}}
				]
		});
	};

	function getTrials(block, defaultTrials){
		return properties.trialsPerBlock && (typeof properties.trialsPerBlock[block] == 'number') ? properties.trialsPerBlock[block] : defaultTrials;
	}

	function longIAT(){
		var v1 = [], v2 = [];

		// build version 1
		addBlock(v1,{part:1,block:1,trials:getTrials(1,20),twoRows:false});
		addBlock(v1,{part:2,block:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v1,{part:3,block:3,trials:getTrials(3,20),twoRows:true});
		addBlock(v1,{part:4,block:4,trials:getTrials(4,40),twoRows:true});
		addBlock(v1,{part:5,block:5,trials:getTrials(5,40),twoRows:false});
		addBlock(v1,{part:6,block:6,trials:getTrials(6,20),twoRows:true});
		addBlock(v1,{part:7,block:7,trials:getTrials(7,40),twoRows:true});

		// build version 2
		addBlock(v2,{part:5,block:1,trials:getTrials(5,20),twoRows:false});
		addBlock(v2,{part:2,block:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v2,{part:6,block:3,trials:getTrials(6,20),twoRows:true});
		addBlock(v2,{part:7,block:4,trials:getTrials(7,40),twoRows:true});
		addBlock(v2,{part:1,block:5,trials:getTrials(1,40),twoRows:false});
		addBlock(v2,{part:3,block:6,trials:getTrials(3,20),twoRows:true});
		addBlock(v2,{part:4,block:7,trials:getTrials(4,40),twoRows:true});

		return !properties.randomize_order ?
			v1
			: [
				{
					mixer: 'choose',
					data: [
						{mixer:'wrapper',data:v1},
						{mixer:'wrapper',data:v2}
					]
				}
			];
	}

	function shortIAT(){
		var v1 = [], v2 = [];

		// build version 1
		addBlock(v1,{part:1,block:1,trials:getTrials(1,20),twoRows:false});
		addBlock(v1,{part:2,block:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v1,{part:3,block:3,trials:getTrials(3,50),twoRows:true});
		addBlock(v1,{part:5,block:4,trials:getTrials(5,30),twoRows:false});
		addBlock(v1,{part:6,block:5,trials:getTrials(6,50),twoRows:true});

		// build version 2
		addBlock(v2,{part:5,block:1,trials:getTrials(5,20),twoRows:false});
		addBlock(v2,{part:2,block:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v2,{part:6,block:3,trials:getTrials(6,50),twoRows:true});
		addBlock(v2,{part:1,block:4,trials:getTrials(1,30),twoRows:false});
		addBlock(v2,{part:3,block:5,trials:getTrials(3,50),twoRows:true});

		return !properties.randomize_order ?
			v1
			: [
				{
					mixer: 'choose',
					data: [
						{mixer:'wrapper',data:v1},
						{mixer:'wrapper',data:v2}
					]
				}
			];
	}

	return function sequence(){
		var sequenceArr = properties.IATversion == 'short' ? shortIAT() : longIAT();
		sequenceArr.push({
			data: {blockStart:true},
			inherit: {set:'instructions', type:'byData', data: {block:'last'}}
		});

		return sequenceArr;
	};

});