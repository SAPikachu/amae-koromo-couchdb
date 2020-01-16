function(doc, req) {
	var result = {};
	var mapLevel = function(rawLevel) {
		return {
			id: rawLevel[0],
			score: rawLevel[1],
			delta: rawLevel[2],
		};
	};
	(doc.data || []).forEach(function(row) {
		result[row.key[0]] = {
			bottom: row.value.results.slice(0, Math.min(10, Math.floor(row.value.results.length / 2))).filter(function(x) { return x.delta < 0; }),
			top: row.value.results.slice(Math.max(row.value.results.length - 10, Math.ceil(row.value.results.length / 2))).filter(function(x) { return x.delta > 0; })
		};
		result[row.key[0]].top.sort(function(a, b) { return b.delta - a.delta; });
		result[row.key[0]].top.concat(result[row.key[0]].bottom).forEach(function(x) {
			x.level = mapLevel(x.level);
		});
	});
  return {
    body : toJSON(result),
    headers : {
			"Cache-Control": "public, max-age=300",
			"Vary": "Origin",
      "Content-Type" : "application/json; charset=utf-8"
    }
  }
}