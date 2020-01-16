function (doc) {
	"use strict";

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
		var data = {
			mode: doc.config.meta.mode_id,
			delta: x.result.grading_score
		};
		emit([doc.start_time, x.player.account_id], data);
	});
}