function (head, req) {
	var row = getRow();
	if (!row) {
		req.query.maxage = 60;
	}
	start({
		headers: {
			"Cache-Control": "public, max-age=" + (req.query.maxage || 60),
			"Vary": "Origin"
		}
	});
	var resp = [];
	if (row) {
		resp.push([row.key, row.value]);
		while (row = getRow()) {
			resp.push([row.key, row.value]);
		}
	}
	return toJSON(resp);
}