define([],function(){

	var v1, v2;

	v1 = [
		// block 1
		{
			data: {block:1, part:1},
			inherit: {set:'instructions', type:'byData', data: {block:1}}
		},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:1}, set:'IAT'}}
			]
		},

		// block 2
		{
			data: {block:2, part:2},
			inherit: {set:'instructions', type:'byData', data: {block:2}}
		},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:2}, set:'IAT'}}
			]
		},

		// block 3
		{
			data: {block:3, part:3},
			inherit: {set:'instructions', type:'byData', data: {block:3}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},

		// block 4
		{
			data: {block:4, part:4},
			inherit: {set:'instructions', type:'byData', data: {block:4}}
		},
		{
			mixer: 'repeat',
			times: 40,
			data: [
				{inherit : {type:'byData', data:{block:4,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:4,row:2}, set:'IAT'}}
			]
		},

		// block 5
		{
			data: {block:5, part:5},
			inherit: {set:'instructions', type:'byData', data: {block:5}}
		},
		{
			mixer : 'repeat',
			times : 40,
			data : [
				{inherit : {type:'byData', data:{block:5}, set:'IAT'}}
			]
		},

		// block 6
		{
			data: {block:6, part:6},
			inherit: {set:'instructions', type:'byData', data: {block:6}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		},

		// block 7
		{
			data: {block:7, part:7},
			inherit: {set:'instructions', type:'byData', data: {block:7}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:7,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:7,row:2}, set:'IAT'}}
			]
		}
	];

	v2 = [
		// block 5
		{
			data: {block:5, part:1},
			inherit: {set:'instructions', type:'byData', data: {block:5}}
		},
		{
			mixer : 'repeat',
			times : 40,
			data : [
				{inherit : {type:'byData', data:{block:5}, set:'IAT'}}
			]
		},

		// block 2
		{
			data: {block:2, part:2},
			inherit: {set:'instructions', type:'byData', data: {block:2}}
		},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:2}, set:'IAT'}}
			]
		},


		// block 6
		{
			data: {block:6, part:3},
			inherit: {set:'instructions', type:'byData', data: {block:6}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:6,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:6,row:2}, set:'IAT'}}
			]
		},

		// block 7
		{
			data: {block:7, part:4},
			inherit: {set:'instructions', type:'byData', data: {block:7}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:7,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:7,row:2}, set:'IAT'}}
			]
		},

		// block 1
		{
			data: {block:1, part:5},
			inherit: {set:'instructions', type:'byData', data: {block:1}}
		},
		{
			mixer : 'repeat',
			times : 20,
			data : [
				{inherit : {type:'byData', data:{block:1}, set:'IAT'}}
			]
		},

		// block 3
		{
			data: {block:3, part:6},
			inherit: {set:'instructions', type:'byData', data: {block:3}}
		},
		{
			mixer: 'repeat',
			times: 20,
			data: [
				{inherit : {type:'byData', data:{block:3,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:3,row:2}, set:'IAT'}}
			]
		},

		// block 4
		{
			data: {block:4, part:7},
			inherit: {set:'instructions', type:'byData', data: {block:4}}
		},
		{
			mixer: 'repeat',
			times: 40,
			data: [
				{inherit : {type:'byData', data:{block:4,row:1}, set:'IAT'}},
				{inherit : {type:'byData', data:{block:4,row:2}, set:'IAT'}}
			]
		}
	];

	return [
		{
			mixer: 'choose',
			data: [
				{mixer:'wrapper',data:v1},
				{mixer:'wrapper',data:v2}
			]
		}
	];

});