module.exports = {
	prepare_response: function (req, maxage, code) {
	  "use strict";
		maxage = maxage || 60;
		code = code || 200;
		if (req && req.query && req.query.maxage) {
			maxage = req.query.maxage;
		}
		return {
			code: code,
			headers: {
				"Cache-Control": "public, max-age=" + maxage + ", stale-while-revalidate=" + maxage + ", stale-if-error=" + maxage,
				"Vary": "Origin",
      	"Content-Type" : "application/json; charset=utf-8",
			}
		};
	},
  start_response: function (req, maxage, code) {
	  "use strict";
		start(module.exports.prepare_response(req, maxage, code));
	},
  build_response: function (req, body, maxage, code) {
	  "use strict";
		var result = module.exports.prepare_response(req, maxage, code);
		result.body = toJSON(body);
		return result;
	},
	error: function (e, maxage, code) {
	  "use strict";
		maxage = maxage || 3600;
		code = code || 400;
		module.exports.start_response(null, maxage, code);
		return toJSON(e);
	},
	reduce_rows: function(req, reducer, final_reducer, initial, validate_key) {
		var row = getRow();
		if (!row) {
			return this.error({error: "no_row_returned"}, 3600, 404);
		}
		if (validate_key) {
			var e = validate_key(row.key);
			if (e) {
				return e;
			}
		}
		module.exports.start_response(req);
		var state = initial;
		while (row) {
			state = reducer(row, state);
			row = getRow();
		}
		if (final_reducer) {
			state = final_reducer(state);
		}
		return toJSON(state);
	},
};