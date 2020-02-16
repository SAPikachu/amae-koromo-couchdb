function(doc) {
  if (!doc.uuid) {
    return;
  }
  var players = {};
  doc.accounts.forEach(function(x) {
    players[x.seat] = {
      player: x
    };
  });
  doc.result.players.forEach(function(x) {
    players[x.seat].result = x;
  });
  var playerList = Object.keys(players).map(function(x) {
    return players[x];
  });
  playerList.sort(function(a, b) {
    return b.result.total_point - a.result.total_point;
  });
  playerList.forEach(function(x, index) {
    var level = x.player[playerList.length > 3 ? "level" : "level3"];
    var data = {
      rank: index + 1,
      nickname: x.player.nickname,
      level: [level.id, level.score, x.result.grading_score],
      score: x.result.part_point_1
    };
    emit([x.player.account_id, 0, doc.start_time], data);
    emit([x.player.account_id, doc.config.meta.mode_id, doc.start_time], data);
  });
}