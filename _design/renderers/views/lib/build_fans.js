module.exports = function (fans) {
	var fanDef = require("views/lib/fan");
	if (!fans || !fans.forEach) {
		throw {"error": "render_error", "reason": toJSON(fans), "field": "fans"}
	}
	var fanMap = {};
	fans.forEach(function(x) {
		if (!fanMap[x]) {
			fanMap[x] = {
				id: x,
				label: fanDef[x].name_chs,
				count: 0,
				役满: fanDef[x].yiman,
			};
		}
		fanMap[x].count++;
	});
	var fanList = Object.keys(fanMap).map(function(x) { return fanMap[x]; });
	fanList.sort(function(a, b) {
		return fanDef[a.id].show_index - fanDef[b.id].show_index;
	});
	return fanList;
};