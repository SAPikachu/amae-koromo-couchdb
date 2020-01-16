function (doc) {
  if (!doc.updated || (!doc.uuid && doc.type !== "roundData")) {
    return;
  }
	if (doc.type === "roundData") {
		emit(doc.updated, { accounts: doc.accounts, mode_id: doc.mode_id});
		return;
	}
	emit(doc.updated, { accounts: doc.accounts.map(function(x) { return x.account_id; }), mode_id: doc.config.meta.mode_id });
}