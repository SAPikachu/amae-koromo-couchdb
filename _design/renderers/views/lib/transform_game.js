module.exports = function (raw) {
	return {
		_id: raw._id,
		modeId: raw.config.meta.mode_id,
		uuid: raw.uuid,
		startTime: raw.start_time,
		endTime: raw.end_time,
		players: raw.accounts.map(function (account) {
			var level = raw.result.players.length > 3 ? account.level : account.level3;
			var playerResult = raw.result.players.filter(function (x) {
				return x.seat === account.seat;
			})[0];
			return {
				accountId: account.account_id,
				nickname: account.nickname,
				level: level.id,
				score: playerResult.part_point_1,
				gradingScore: playerResult.grading_score
			};
		})
	};
};