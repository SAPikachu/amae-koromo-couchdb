function (doc) {
  if (!doc.uuid) {
    return;
  }
  var players = {};
  doc.accounts.forEach(function (x) {
		players[x.seat] = { player: x };
	});
  doc.result.players.forEach(function (x) {
		players[x.seat].result = x;
	});
  var playerList = Object.keys(players).map(function(x) {
		return players[x];
	});
  playerList.forEach(function(x, index) {
		var normalizedName = x.player.nickname.toLowerCase().replace(/(^\s+|\s+$)/g, "");
		if (normalizedName) {
			emit([normalizedName, x.player.account_id, doc.start_time], {
				nickname: x.player.nickname,
				level: [x.player.level.id, x.player.level.score, x.result.grading_score]
			});
		}
	});
}