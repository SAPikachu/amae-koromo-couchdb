function(doc, req) {
  return {
    body : toJSON(doc.data),
    headers : {
			"Cache-Control": "public, max-age=" + (doc.cache || 3600) + ", stale-while-revalidate=7200, stale-if-error=7200",
			"Vary": "Origin",
      "Content-Type" : "application/json; charset=utf-8"
    }
  }
}