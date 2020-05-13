function(req2) {
	"use strict";
	var prefix = req2.path[4];
	if (prefix !== "api-test") {
		return {
			code: 200,
			headers: {
				"Cache-Control": "max-age=15",
				"Content-Type": "application/json; charset=utf-8"
			},
			body: toJSON({
				maintenance: "因数据库出现问题，临时维护中，目前预计14日恢复 / ただいまメンテナンス中、14日に復旧できる見込みです。"
			})
		};
	}
	var basename = req2.path[0];
	var method = req2.path[5];
	var params = req2.path.slice(6);
	if (!method) {
		return {
			code: 400,
			body: toJSON({
				error: "bad_request"
			})
		};
	}
	var MS_PER_DAY = 1000 * 60 * 60 * 24;
	var parseTs = function(val) {
		"use strict";
		var result;
		try {
			if (typeof val === "string") {
				if (val.charAt(0) === "[") {
					val = JSON.parse(val);
				} else if (/^\d+$/.test(val)) {
					val = parseInt(val);
				}
			}
			if (typeof val === "object" && val.length) {
				val[1]--; // Fix month
				val = Date.UTC.apply(Date, val);
			}
			if (typeof val === "number" && val < (new Date(2000, 0, 1)).getTime()) {
				val = val * 1000;
			}
			result = new Date(val);
		} catch (e) {
			log("Failed to parse timestamp");
			log(e);
			return null;
		}
		if (result.toString().toLowerCase() === "invalid date") {
			return null;
		}
		return result;
	};
	var dateToKey = function(date) {
		return [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours()];
	};
	var dateToSecKey = function(date) {
		return date.getTime() / 1000;
	};
	if (req2.query.limit && parseInt(req2.query.limit) > 500) {
		req2.query.limit = "500";
	}
	switch (method) {
		case "recent_highlight_games":
			return {
				path: "/../renderers/_list/highlight_games/highlight_games/highlight_games",
				query: {
					"limit": req2.query.limit || "100",
					"skip": req2.query.skip || "0",
					"include_docs": "true",
					"maxage": "300",
					"reduce": "false",
					"descending": "true",
					"stable": "false",
					"update": "lazy"
				}
			};
			break;
		case "fan_stats":
			return {
				path: "/../renderers/_list/fan_stats/fan_stats/fan_stats",
				query: ({
					"group_level": "2",
					"maxage": "3600",
					"stable": "false",
					"update": "lazy"
				})
			};
			break;
		case "global_statistics":
			return {
				query: {
					maxage: "3600",
				},
				path: "/../../../" + basename + "_aggregates/_design/renderers/_show/global_statistics/global_statistics",
			};
			break;
		case "career_ranking":
			var type = params[0];
			if (!type) {
				return {
					code: 400,
					body: toJSON({
						error: "no_param"
					})
				};
			}
			return {
				path: "/../../../" + basename + "_aggregates/_design/renderers/_show/career_ranking/career_ranking_" + type,
				query: {
					mode: req2.query.mode || ""
				}
			};
			break;
		case "rank_rate_by_seat":
			return {
				query: {
					maxage: "3600",
					group: "true",
					"stable": "false",
					"update": "lazy"
				},
				path: "/../renderers/_list/rank_rate_by_seat/rank_rate_by_seat/rank_rate_by_seat"
			};
			break;
		case "player_delta_ranking":
			var range = params[0];
			if (range !== "1w" && range !== "4w") {
				return {
					code: 400,
					body: toJSON({
						error: "invalid_param"
					})
				};
			}
			return {
				path: "/../../../" + basename + "_aggregates/_design/renderers/_show/generic_data/player_delta_ranking_" + range
			};
			break;
		case "search_player":
			var prefix = params[0];
			if (!prefix) {
				return {
					code: 400,
					body: toJSON({
						error: "no_param"
					})
				};
			}
			return {
				path: "/../renderers/_list/search_player/nicknames/nicknames",
				query: {
					"limit": req2.query.limit || "20",
					"startkey": toJSON([prefix]),
					"endkey": toJSON([prefix + "\uffff"]),
					"group_level": "2",
					"stable": "false",
					"update": "lazy"
				}
			};
			break;
		case "player_records":
		case "player_stats":
		case "player_extended_stats":
			var id = parseInt(params[0]);
			if (!id) {
				return {
					code: 400,
					body: toJSON({
						error: "invalid_id"
					})
				};
			}
			var startDate = parseTs(params[1] || "0");
			var endDate = params[2] ? parseTs(params[2]) : null;
			var key = [id];
			var view = "player_stats_2";
			if (req2.query.mode) {
				var modeId = parseInt(req2.query.mode);
				if (!modeId) {
					return {
						code: 400,
						body: toJSON({
							error: "invalid_mode_id"
						})
					};
				}
				key.push(modeId);
			} else {
				key.push(0);
			}
			if (method === "player_records") {
				return {
					path: "/../renderers/_list/result_from_doc/" + view + "/player_stats",
					query: {
						"limit": req2.query.limit || "100",
						"skip": req2.query.skip || "0",
						"reduce": "false",
						"include_docs": "true",
						"startkey": toJSON(key.concat([dateToSecKey(startDate)])),
						"endkey": toJSON(key.concat([endDate ? dateToSecKey(endDate) : {}])),
						"stable": "false",
						"update": "lazy"
					}
				};
			}
			if (method === "player_extended_stats") {
				return {
					path: "/../renderers/_list/player_extended_stats/player_extended_stats/player_stats",
					query: ({
						"group_level": key.length.toString(),
						"startkey": toJSON(key.concat([dateToSecKey(startDate)])),
						"endkey": toJSON(key.concat([endDate ? dateToSecKey(endDate) : {}])),
						"stable": "false",
						"update": "lazy"
					})
				};
			}
			return {
				path: "/../renderers/_list/player_stats/" + view + "/player_stats",
				query: ({
					"group_level": key.length.toString(),
					"startkey": toJSON(key.concat([dateToSecKey(startDate)])),
					"endkey": toJSON(key.concat([endDate ? dateToSecKey(endDate) : {}])),
					"stable": "false",
					"update": "lazy"
				})
			};
			break;
		case "games":
		case "count":
			var startTs = parseTs(params[0]);
			if (!startTs) {
				return {
					code: 400,
					body: toJSON({
						error: "invalid_start_time"
					})
				};
			}
			var endTs = params[1] ? parseTs(params[1]) : new Date(startTs.getTime() + MS_PER_DAY);
			if (!endTs) {
				return {
					code: 400,
					body: toJSON({
						error: "invalid_end_time"
					})
				};
			}
			var cacheMaxAge = (endTs.getTime() < (new Date()).getTime() - MS_PER_DAY / 2) ? 86400 : 60;
			if (method === "count") {
				return {
					path: "/../renderers/_list/single_value/default/by_time",
					query: {
						"startkey": toJSON(dateToKey(startTs)),
						"endkey": toJSON(dateToKey(endTs)),
						"maxage": cacheMaxAge.toString(),
						"stable": "false",
						"update": "lazy",
						"default": '{"count":0}'
					}
				};
			}
			return {
				path: "/../renderers/_list/result/default/by_time",
				query: {
					"limit": req2.query.limit || "100",
					"skip": req2.query.skip || "0",
					"startkey": toJSON(dateToKey(startTs)),
					"endkey": toJSON(dateToKey(endTs)),
					"maxage": (cacheMaxAge * 15).toString(),
					"reduce": "false",
					"stable": "false",
					"update": "lazy"
				}
			};
			break;
	}
	return {
		code: 404,
		body: toJSON({
			error: "unknown_method"
		})
	};
}