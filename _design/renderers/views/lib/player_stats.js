exports.func = function(value) {
	"use strict";
	var convert_level = require("views/lib/convert_level").func;
	var ranks = value.accum.slice(0, 4);
	var result = {
		count: sum(ranks),
		level: value.level && convert_level(value.level),
		max_level: value.max_level && convert_level(value.max_level),
	};
	result.rank_rates = ranks.map(function(x) { return x / result.count; });
	if (value.score_accum) {
		result.rank_avg_score = value.score_accum.map(function(x, i) {
			return Math.round(x / ranks[i] * 100);
		});
	}
	result.avg_rank = sum(ranks.map(function(x, index) { return x * (index + 1); })) / result.count;
	result.negative_rate = value.accum[4] / result.count;
	return result;
}