function (head, req) {
	"use strict";
  var r = require("views/lib/resp_utils");
  var fan = require("views/lib/fan");
	return r.reduce_rows(req, function(row, state) {
		var mode = row.key[0];
		state[mode] = state[mode] || { entries: {} };
		var id = row.key[1];
		if (id < 0) {
			state[mode].count = row.value;
		} else {
			state[mode].entries[id] = {
				label: fan[id].name_chs,
				sort: fan[id].show_index,
				count: row.value,
			};
		}
		return state;
	}, function(state) {
		Object.keys(state).forEach(function(mode) {
			if (mode.toString() !== "0") {
				Object.keys(state[0].entries).forEach(function(id) {
					if (!state[mode].entries[id]) {
						state[mode].entries[id] = {
							count: 0,
							label: state[0].entries[id].label,
							sort: state[0].entries[id].sort,
						};
					}
				});
			}
		});
		Object.keys(state).forEach(function(mode) {
			var entries = Object.keys(state[mode].entries).map(function(x) { return state[mode].entries[x]; });
			entries.sort(function(a, b) { return a.sort - b.sort; });
			entries.forEach(function(x) { delete x.sort; });
			state[mode].entries = entries;
		});
		return state;
	}, {}, function(key) {
		if (!key || key.length < 2) {
			return r.error({error: "invalid_grouping"}, 86400);
		}
	});
}