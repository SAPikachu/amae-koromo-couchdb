function (head, req) {
	var transform = function (raw) {
		return {
			modeId: raw.config.meta.mode_id,
			uuid: raw.uuid,
			startTime: raw.start_time,
			endTime: raw.end_time,
			players: raw.accounts.map(function (account) {
				return {
					accountId: account.account_id,
					nickname: account.nickname,
					level: account.level.id,
					score: raw.result.players.filter(function (x) {
						return x.seat === account.seat;
					})[0].part_point_1
				};
			})
		};
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