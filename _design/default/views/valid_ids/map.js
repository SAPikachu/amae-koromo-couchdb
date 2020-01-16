function (doc) {

    if (doc.uuid && doc.data_version && doc.version >= 2) {

	    emit(doc.uuid, null);

	}

}