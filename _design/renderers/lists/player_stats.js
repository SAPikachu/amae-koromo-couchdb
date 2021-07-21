function (head, req) {
  var r = require("views/lib/resp_utils");
	var row = getRow();
	if (!row) {
		return r.error({error: "id_not_found"}, 3600, 404);
	}
	if (!row.key || row.key.length < 1) {
		return r.error({error: "invalid_grouping"}, 86400);
	}
	r.start_response(req);
	var result = require("views/lib/player_stats").func(row.value);
	result.id = row.key[0];
	result.nickname = row.value.nickname;
	return toJSON(result);
}