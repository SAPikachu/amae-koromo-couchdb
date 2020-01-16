function (doc) {
  if (doc.type === "roundData" && doc.version >= 6) {
	  emit(doc.game._id, null);
	}
}