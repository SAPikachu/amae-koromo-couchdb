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
		var dedup = {};
		fans.forEach(function(x) {
			if (dedup[x]) {
				return;
			}
			dedup[x] = true;
			fan += (役满倍数[x] || 0) * 13;
		});
		return { scoring: fan };
	};
  doc.accounts.forEach(function(accountId, seat) {
		var data = {
			count: 0,
		};
		function inc(key, val) {
			if (val === 0) {
				return;
			}
			val = val || 1;
			if (!data[key]) {
				data[key] = val;
			} else {
				data[key] += val;
			}
		}
		var 最大连庄 = 0;
		doc.data.forEach(function(round, index) {
			data.count++;
			var player = round[seat];
			if (player.和) {
				inc("和");
				inc("和了点数", player.和[0] / 100);
				inc("和了巡数", player.和[2]);
				if (player.自摸) {
					inc("自摸");
				}
				if (player.立直) {
					inc("立直和了");
				}
				if (player.副露) {
					inc("副露和了");
				}
				if (!player.副露 && !player.立直) {
					inc("默听");
				}
				if (player.和[1].indexOf(30) > -1) {
					inc("一发");
				}
				if (player.和[1].indexOf(33) > -1) {
					inc("里宝");
				}
				var fan = getFan(player.和[1]);
				data.最大累计番数 = Math.max(data.最大累计番数 || 0, fan.actual || 0);
				if (fan.scoring >= 13) {
					inc("役满");
					if (fan.actual) {
						inc("累计役满");
					}
				}
			}
			if (player.放铳) {
				inc("放铳");
				inc("放铳点数", player.放铳 / 100);
				if (player.立直) {
					inc("放铳时立直");
				}
				if (player.副露) {
					inc("放铳时副露");
				}
				round.forEach(function(x) {
					if (!x.和) {
						return;
					};
					if (x.立直) {
						inc("放铳至立直");
					}
					if (x.副露) {
						inc("放铳至副露");
					}
					if (!x.副露 && !x.立直) {
						inc("放铳至默听");
					}
					var fanNew = getFan(x.和[1]);
					if (fanNew.scoring <= 5) {
						return;
					}
					if (data.最近大铳) {
						var fanExisting = getFan(data.最近大铳[1]);
						if (fanExisting.scoring > fanNew.scoring) {
							return;
						}
					}
					data.最近大铳 = x.和.concat([doc.game._id, doc.start_time]);
				});
			}
			if (player.立直) {
				inc("立直");
				inc("立直巡目", player.立直);
				inc("振听立直", player.振听立直 ? 1 : 0);
				if (player.和) {
					inc("立直收入", player.和[0] / 100);
				} else if (player.放铳 || player.包牌) {
					var mod = 1000;
					round.filter(function(x) { return x.和; }).forEach(function(x) {
						if (Math.abs(x.和[2] - player.立直 - (1 / doc.accounts.length)) < 0.01) {
							mod = 0;
						}
					});
					if (!mod) {
						inc("立直瞬间放铳");
					}
					inc("立直支出", ((player.放铳 || player.包牌) + mod) / 100);
				} else if (player.流听 && !round.filter(function(x) { return x.流满; }).length) {
					var 流听玩家数 = round.filter(function(x) { return x.流听; }).length;
					inc("立直流局收支", ([undefined, 3000, 1500, 1000, 0][流听玩家数] - 1000) / 100);
				} else {
					inc("立直其它收支", -1000 / 100);
				}
				var 立直玩家 = round.filter(function(x) { return x.立直; }).sort(function(a, b) { return a.立直 - b.立直; });
				var 立直Index = 立直玩家.indexOf(player);
				if (立直Index === 0) {
					inc("先制立直");
				}
				if (立直Index > 0) {
					inc("追立");
				}
				if (立直Index + 1 < 立直玩家.length) {
					inc("被追立");
				}
			}
			inc("起手向听", player.起手向听);
			inc("W立直", player.W立直 ? 1 : 0);
			inc("流满", player.流满 ? 1 : 0);
			inc("副露", player.副露 ? 1 : 0);
			if ("流听" in player) {
				inc("流局");
				inc("流局听牌", player.流听 ? 1 : 0);
				if (player.立直) {
					inc("立直流局");
				}
				if (player.副露) {
					inc("副露流局");
				}
			}
			var 自摸玩家 = round.filter(function(x) { return x.自摸; });
			if (!player.和 && 自摸玩家.length) {
				inc("被自摸");
				if (player.亲 && 自摸玩家[0].和[0] >= 8000) {
					inc("被炸");
					inc("被炸点数", 自摸玩家[0].和[0] / 100);
				}
			}
			if (player.亲 && index > 0 && doc.data[index - 1][seat].亲) {
				最大连庄++;
				data.最大连庄 = Math.max(data.最大连庄 || 0, 最大连庄);
			} else {
				最大连庄 = 0;
			}
		});
		emit([accountId, 0, doc.start_time], data);
		emit([accountId, doc.mode_id, doc.start_time], data);
	});
}