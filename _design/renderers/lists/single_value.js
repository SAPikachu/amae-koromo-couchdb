function (head, req) {
	var row = getRow();
	if (!row) {
		if (req.query.default) {
			start({
				headers: {
					"Cache-Control": "public, max-age=" + (req.query.maxage || 60),
					"Vary": "Origin"
				}
			});
			return req.query.default;
		}
		start({
			code: 404,
			headers: {
				"Cache-Control": "public, max-age=3600",
				"Vary": "Origin"
			}
		});
		return toJSON({error: "not_found"});
	}
	start({
		headers: {
			"Cache-Control": "public, max-age=" + (req.query.maxage || 60),
		  "Vary": "Origin"
		}
	});
	return toJSON(row.value);
}