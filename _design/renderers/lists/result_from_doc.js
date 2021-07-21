function(head, req) {
	var transform = require("views/lib/transform_game");
	var row = getRow();
	if (!row) {
		req.query.maxage = 60;
	}
	if (req.query.single) {
		start({
			stop: true,
			code: row ? 200 : 404,
			headers: {
				"Cache-Control": "public, max-age=" + (row ? (req.query.maxage || 60) : 3600),
				"Vary": "Origin"
			}
		});
		if (!row) {
			return toJSON({
				error: "id_not_found"
			});
		}
		return toJSON(row.doc ? transform(row.doc) : row.value);
	}
	start({
		headers: {
			"Cache-Control": "public, max-age=" + (req.query.maxage || 60),
			"Vary": "Origin"
		}
	});
	var resp = [];
	if (row) {
		resp.push(row.doc ? transform(row.doc) : row.value);
		while (row = getRow()) {
			resp.push(row.doc ? transform(row.doc) : row.value);
		}
	}
	return toJSON(resp);
}