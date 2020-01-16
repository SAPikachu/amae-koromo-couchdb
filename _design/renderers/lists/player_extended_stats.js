function (head, req) {
	var row = getRow();
	if (!row) {
		start({
			code: 404,
			headers: {
				"Cache-Control": "public, max-age=3600",
				"Vary": "Origin"
			}
		});
		return toJSON({error: "id_not_found"});
	}
	if (row.key.length < 2) {
		start({
			code: 400,
			headers: {
				"Cache-Control": "public, max-age=86400",
				"Vary": "Origin"
			}
		});
		return toJSON({error: "invalid_grouping"});
	}
	start({
		headers: {
			"Cache-Control": "public, max-age=60",
			"Vary": "Origin"
		}
	});
	var result = require("views/lib/convert_extended_stats").func(row.value);
	result.id = row.key[0];
	return toJSON(result);
}