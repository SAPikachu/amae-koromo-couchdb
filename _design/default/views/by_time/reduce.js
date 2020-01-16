function (keys, values, rereduce) {
	var result = {};
  if (rereduce) {
		result.count = sum(values.map(function(x) { return x.count || 0; }));
		// result.last_time = values.map(function(x) { return x.last_time; }).reduce(function(a, b) { return a > b ? a : b; }, 0);
  } else {
		result.count = values.length || 0;
		// result.last_time = keys.map(function(x) { return x[0][4]; }).reduce(function(a, b) { return a > b ? a : b; }, 0);
  }
  return result;
}