function (keys, values, rereduce) {
	var result = { nickname: "", level: undefined, latest_timestamp: 0, count: 0 };
  if (rereduce) {
    values.forEach(function(x) {
			if (x.latest_timestamp > result.latest_timestamp) {
				result.latest_timestamp = x.latest_timestamp;
				result.nickname = x.nickname;
				result.level = x.level;
			  result.id = x.id;
			}
			result.count += x.count;
    });
  } else {
    values.forEach(function(x, index) {
			var ts = keys[index][0][2];
			if (ts > result.latest_timestamp) {
				result.latest_timestamp = ts;
				result.nickname = x.nickname;
				result.level = x.level;
			  result.id = keys[index][0][1];
			}
			result.count += 1;
    });
  }
  return result;
}