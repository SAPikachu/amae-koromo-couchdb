function (head, req) {
	"use strict";
  var r = require("views/lib/resp_utils");
  var transform_game = require("views/lib/transform_game");
	var buildFans = require("views/lib/build_fans");
	return r.reduce_rows(req, function(row, state) {
		row.value.events.forEach(function(event) {
			var result = transform_game(row.doc);
			if (event.type === "役满") {
				event.fan = buildFans(event.fan);
			}
			result.event = event;
			state.push(result);
		});
		return state;
	}, function(state) {
		return state;
	}, []);
}