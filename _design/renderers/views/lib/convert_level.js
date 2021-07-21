exports.func = function(value) {
	return {
		id: value[0],
		score: value[1],
		delta: value[2],
	};
}