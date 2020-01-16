function(doc, req) {
  return {
    body : toJSON(doc.data),
    headers : {
			"Cache-Control": "public, max-age=300",
			"Vary": "Origin",
      "Content-Type" : "application/json; charset=utf-8"
    }
  }
}