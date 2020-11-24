function (doc) {
	"use strict";
  if (doc.type !== "roundData") {
    return;
  }
	var result = {};
	function inc(id) {
		if (!result[id]) {
			result[id] = 0;
		}
		result[id]++;
	}
  doc.accounts.forEach(function(accountId, seat) {
		doc.data.forEach(function(round, index) {
			var player = round[seat];
			if (player.和) {
				inc(-127);
				
				var emitted = {};
				player.和[1].forEach(function(x) {
					if (emitted[x]) {
						return;
					}
					emitted[x] = true;
					inc(x);
				});
			}
		});
	});
	Object.keys(result).forEach(function(key) {
		emit([doc.mode_id, parseInt(key, 10)], result[key]);
	});
}