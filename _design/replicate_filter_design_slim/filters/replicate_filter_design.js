function(doc, req) {
  return (doc._id.indexOf("_design/") === 0 &&
					doc._id !== "_design/validate_doc_update" &&
					doc._id !== "_design/player_stats_2" &&
					doc._id !== "_design/updated_players" &&
					doc._id !== "_design/player_extended_stats" &&
					doc._id !== "_design/rank_rate_by_seat" &&
					doc._id !== "_design/highlight_games" &&
					doc._id !== "_design/fan_stats" &&
					doc._id !== "_design/default" &&
					doc._id !== "_design/nicknames") ||
		doc._id.indexOf("data") === 0;
}