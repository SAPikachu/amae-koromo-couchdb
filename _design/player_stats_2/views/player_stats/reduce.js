function(keys, values, rereduce) {
  var result = {
    accum: [0, 0, 0, 0, 0],
    score_accum: [0, 0, 0, 0],
    nickname: "",
    level: undefined,
    max_level: undefined,
    latest_timestamp: 0
  };
  var getMaxLevel = function(level) {
    var maxLevel = (result.max_level || level).slice(0);
    if (maxLevel[0] % 10000 === 601) {
      maxLevel = [maxLevel[0] + 100, Math.ceil((maxLevel[1] + maxLevel[2]) / 100) * 10 + 200, 0];
    }
    if (maxLevel[0] !== level[0]) {
      maxLevel = (maxLevel[0] >= level[0]) ? maxLevel : level.slice(0);
    } else if (level[1] + Math.max(level[2], 0) > maxLevel[1] + Math.max(maxLevel[2], 0)) {
      maxLevel = level.slice(0);
    }
    maxLevel[2] = Math.max(maxLevel[2], 0);
    return maxLevel;
  };
  if (rereduce) {
    values.forEach(function(x) {
      if (x.latest_timestamp > result.latest_timestamp) {
        result.latest_timestamp = x.latest_timestamp;
        result.nickname = x.nickname;
        result.level = x.level;
      }
      result.max_level = getMaxLevel(x.max_level);
      x.accum.forEach(function(count, i) {
        result.accum[i] += count;
      });
      x.score_accum.forEach(function(count, i) {
        result.score_accum[i] += count;
      });
    });
  } else {
    values.forEach(function(x, index) {
      var ts = keys[index][0][2];
      if (ts > result.latest_timestamp) {
        result.latest_timestamp = ts;
        result.nickname = x.nickname;
        result.level = x.level;
      }
      result.max_level = getMaxLevel(x.level);
      result.accum[x.rank - 1]++;
      result.score_accum[x.rank - 1] += x.score　 / 100;
      if (x.score < 0) {
        result.accum[4]++;
      }
    });
  }
  return result;
}