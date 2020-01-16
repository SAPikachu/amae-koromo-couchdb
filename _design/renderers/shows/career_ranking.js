function(doc, req) {
	var mapLevel = function(rawLevel) {
		return {
			id: rawLevel[0],
			score: rawLevel[1],
			delta: rawLevel[2],
		};
	};
	var result = doc.data[req.query.mode || "0"] || [];
	result.forEach(function(x) { x.level = mapLevel(x.level); });
  return {
    body : toJSON(result),
    headers : {
			"Cache-Control": "public, max-age=3600",
			"Vary": "Origin",
      "Content-Type" : "application/json; charset=utf-8"
    }
  }
}