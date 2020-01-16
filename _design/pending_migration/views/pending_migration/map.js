function (doc) {
  if (doc.type === "roundData" && doc.version < 6) {
    emit(doc._id, { game: doc.game });
	}
}