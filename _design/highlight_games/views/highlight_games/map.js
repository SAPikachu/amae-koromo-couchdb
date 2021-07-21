function (doc) {
	"use strict";
  if (doc.type !== "roundData") {
    return;
  }
	var 役满倍数 = {
		"35": 1,
		"36": 1,
		"37": 1,
		"38": 1,
		"39": 1,
		"40": 1,
		"41": 1,
		"42": 1,
		"43": 1,
		"44": 1,
		"45": 1,
		"46": 1,
		"47": 2,
		"48": 2,
		"49": 2,
		"50": 2
	};
	var getFan = function(fans) {
		if (!役满倍数[fans[0]]) {
			return { scoring: Math.min(fans.length, 13), actual: fans.length };
		}
		var fan = 0;
		fans.forEach(function(x) {
			fan += (役满倍数[x] || 0) * 13;
		});
		return { scoring: fan };
	};
	var events = [];
  doc.accounts.forEach(function(accountId, seat) {
		doc.data.forEach(function(round, index) {
			var player = round[seat];
			if (player.和) {
				var fan = getFan(player.和[1]);
				if (fan.scoring >= 13) {
					events.push({
						type: "役满",
						fan: player.和[1],
						player: accountId,
					});
				}
			}
		});
	});
	if (!events.length) {
		return;
	}
	var data = {
		mode_id: doc.mode_id,
		events: events,
	};
	emit([doc.mode_id, doc.start_time], data);
}