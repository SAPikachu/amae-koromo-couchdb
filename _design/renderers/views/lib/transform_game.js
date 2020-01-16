module.exports = function (raw) {
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