function(doc, req) {
  var r = require("views/lib/resp_utils");
	if (doc.type !== "globalStatistics") {
		return r.build_response(null, {error: "invalid_doc"}, 60, 500);
	}
  var player_stats = require("views/lib/player_stats").func;
  var convert_extended_stats = require("views/lib/convert_extended_stats").func;
	var data = doc.data;
	Object.keys(data).forEach(function(modeKey) {
		var levels = data[modeKey];
		Object.keys(levels).forEach(function(levelKey) {
			var raw = levels[levelKey];
			delete raw.最近大铳;
			levels[levelKey] = {
				num_players: raw.num_players,
				basic: player_stats(raw),
				extended: convert_extended_stats(raw),
			};
		});
	});
	return r.build_response(req, data, 3600);
}