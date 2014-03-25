define(['./properties'],function(properties){

	/**
	 * Takes a sequence array and pushes in a block according to the settings in blockObj:
	 * {
	 *  block: 1,
	 *  part: 1,
	 *  twoRows: false,
	 *  trials: 20
	 * }
	 */

	var addBlock = function addBlock(sequenceArr, blockObj){

		// push instructions
		sequenceArr.push({
			data: {block:blockObj.block, part:blockObj.part, IATversion:properties.IATversion, blockStart:true},
			inherit: {set:'instructions', type:'byData', data: {block:blockObj.block}}
		});

		// push block trials
		sequenceArr.push({
			mixer : 'repeat',
			times : !blockObj.twoRows ? blockObj.trials : Math.floor(blockObj.trials/2),
			data : !blockObj.twoRows ?
				// if we have one row
				[
					{inherit : {type:'byData', data:{block:blockObj.block}, set:'IAT'}}
				]
				// if we have two rows
				: [
					{inherit : {type:'byData', data:{block:blockObj.block,row:1}, set:'IAT'}},
					{inherit : {type:'byData', data:{block:blockObj.block,row:2}, set:'IAT'}}
				]
		});
	};

	function getTrials(block, defaultTrials){
		return properties.trialsPerBlock && (typeof properties.trialsPerBlock[block] == 'number') ? properties.trialsPerBlock[block] : defaultTrials;
	}

	function longIAT(){
		var v1 = [], v2 = [];

		// build version 1
		addBlock(v1,{block:1,part:1,trials:getTrials(1,20),twoRows:false});
		addBlock(v1,{block:2,part:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v1,{block:3,part:3,trials:getTrials(3,20),twoRows:true});
		addBlock(v1,{block:4,part:4,trials:getTrials(4,40),twoRows:true});
		addBlock(v1,{block:5,part:5,trials:getTrials(5,40),twoRows:false});
		addBlock(v1,{block:6,part:6,trials:getTrials(6,20),twoRows:true});
		addBlock(v1,{block:7,part:7,trials:getTrials(7,40),twoRows:true});

		// build version 2
		addBlock(v2,{block:5,part:1,trials:getTrials(5,20),twoRows:false});
		addBlock(v2,{block:2,part:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v2,{block:6,part:3,trials:getTrials(6,20),twoRows:true});
		addBlock(v2,{block:7,part:4,trials:getTrials(7,40),twoRows:true});
		addBlock(v2,{block:1,part:5,trials:getTrials(1,40),twoRows:false});
		addBlock(v2,{block:3,part:6,trials:getTrials(3,20),twoRows:true});
		addBlock(v2,{block:4,part:7,trials:getTrials(4,40),twoRows:true});

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
		addBlock(v1,{block:1,part:1,trials:getTrials(1,20),twoRows:false});
		addBlock(v1,{block:2,part:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v1,{block:3,part:3,trials:getTrials(3,50),twoRows:true});
		addBlock(v1,{block:5,part:4,trials:getTrials(5,30),twoRows:false});
		addBlock(v1,{block:6,part:5,trials:getTrials(6,50),twoRows:true});

		// build version 2
		addBlock(v2,{block:5,part:1,trials:getTrials(5,20),twoRows:false});
		addBlock(v2,{block:2,part:2,trials:getTrials(2,20),twoRows:false});
		addBlock(v2,{block:6,part:3,trials:getTrials(6,50),twoRows:true});
		addBlock(v2,{block:1,part:4,trials:getTrials(1,30),twoRows:false});
		addBlock(v2,{block:3,part:5,trials:getTrials(3,50),twoRows:true});

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
		return properties.IATversion == 'short' ? shortIAT() : longIAT();
	};

});