function (doc) {
  if (doc.uuid && doc.version >= 2) {
	  emit(doc.uuid, null);
	}
}