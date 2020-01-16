function (doc) {
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
	if (doc.uuid) {
		var date = new Date(doc.start_time * 1000);
		emit([date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), doc.start_time], transform(doc));
	}
}