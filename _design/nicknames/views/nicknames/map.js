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
			var level = x.player[playerList.length > 3 ? "level" : "level3"];
			emit([normalizedName, x.player.account_id, doc.start_time], {
				nickname: x.player.nickname,
				level: [level.id, level.score, x.result.grading_score]
			});
		}
	});
}