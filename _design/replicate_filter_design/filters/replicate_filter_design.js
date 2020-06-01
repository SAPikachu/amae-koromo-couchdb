function(doc, req) {
  return (doc._id.indexOf("_design/") === 0 && doc._id !== "_design/validate_doc_update") || doc._id.indexOf("data") === 0;
}