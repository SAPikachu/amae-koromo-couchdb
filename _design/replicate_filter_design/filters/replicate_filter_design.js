function(doc, req) {
  return (doc._id.indexOf("_design/") === 0 && doc._id !== "_design/default" && doc._id !== "_design/default_test") || doc._id.indexOf("data") === 0;
}