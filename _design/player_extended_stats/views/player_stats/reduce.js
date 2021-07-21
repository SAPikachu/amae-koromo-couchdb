function (keys, values, rereduce) {
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
	var result = { };
	values.forEach(function(x) {
		Object.keys(x).forEach(function(key) {
			if (!(key in result)) {
				result[key] = 0;
			}
			if (key.indexOf("最大") === 0 || key === "latest_timestamp") {
				result[key] = Math.max(result[key], x[key]);
			} else if (key === "最近大铳") {
				if (result[key]) {
					var fanExisting = getFan(result[key][1]);
					var fanNew = getFan(x[key][1]);
					if (fanExisting.scoring > fanNew.scoring) {
						return;
					}
					if (fanExisting.scoring === fanNew.scoring && result[key][4] > x[key][4]) {
						// Older
						return;
					}
				}
				result[key] = x[key];
			} else {
				result[key] += x[key];
			}
		});
	});
  return result;
}