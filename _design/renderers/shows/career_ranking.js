function(doc, req) {
	var convertExtendedStats = require("views/lib/convert_extended_stats").func;
	var playerStats = require("views/lib/player_stats").func;
	var mapLevel = require("views/lib/convert_level").func;
	var result = doc.data[req.query.mode || "0"] || [];
	result = result.map(function(x) {
		var r = playerStats(x);
		r.extended_stats = convertExtendedStats(x.extended);
		r.count = x.count;
		r.rank_key = x.rank_key;
		r.id = x.id;
		r.nickname = x.nickname;
		return r;
	});
  return {
    body : toJSON(result),
    headers : {
			"Cache-Control": "public, max-age=3600",
			"Vary": "Origin",
      "Content-Type" : "application/json; charset=utf-8"
    }
  }
}