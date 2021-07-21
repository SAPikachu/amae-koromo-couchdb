function (doc) {
  if (!doc.uuid) {
    return;
  }
  var players = {};
  doc.accounts.forEach(function (x) {
		players[x.seat] = { player: x, seat: x.seat };
	});
  doc.result.players.forEach(function (x) {
		players[x.seat].result = x;
	});
  var playerList = Object.keys(players).map(function(x) {
		return players[x];
	});
  playerList.sort(function(a, b) {
		return b.result.total_point - a.result.total_point;
	});
  playerList.forEach(function(x, index) {
		emit([doc.config.meta.mode_id, index + 1, x.seat], 1);
	});
}