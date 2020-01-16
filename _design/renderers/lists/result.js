function (head, req) {
	var transform = function (row) {
		return toJSON(row.value);
	};
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
			return toJSON({error: "id_not_found"});
		}
		return transform(row);
	}
	start({
		headers: {
			"Cache-Control": "public, max-age=" + (req.query.maxage || 60),
			"Vary": "Origin"
		}
	});
	var resp = [];
	if (row) {
		resp.push(row.value);
		while (row = getRow()) {
			resp.push(row.value);
		}
	}
	return toJSON(resp);
}