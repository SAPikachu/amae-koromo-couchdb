function (doc) {
	"use strict";
  if (doc.type !== "roundData") {
    return;
  }
  doc.accounts.forEach(function(accountId, seat) {
		doc.data.forEach(function(round, index) {
			var player = round[seat];
			if (player.和) {
				emit([0, -127, doc.start_time], 1);
				emit([doc.mode_id, -127, doc.start_time], 1);
				
				var emitted = {};
				player.和[1].forEach(function(x) {
					if (emitted[x]) {
						return;
					}
					emitted[x] = true;
					emit([0, x, doc.start_time], 1);
					emit([doc.mode_id, x, doc.start_time], 1);
				});
			}
		});
	});
}