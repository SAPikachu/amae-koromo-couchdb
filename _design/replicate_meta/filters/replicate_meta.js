function(doc, req) {
  return !doc.uuid && doc.type !== "roundData";
}