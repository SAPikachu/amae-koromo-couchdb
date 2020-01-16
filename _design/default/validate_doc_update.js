function (newDoc, oldDoc, userCtx, secObj) {
	var ddoc = this;

	secObj.admins = secObj.admins || {};
	secObj.admins.names = secObj.admins.names || [];
	secObj.admins.roles = secObj.admins.roles || [];

	var IS_DB_ADMIN = false;

	if (~userCtx.roles.indexOf('_admin')) IS_DB_ADMIN = true;
	if (~secObj.admins.names.indexOf(userCtx.name)) IS_DB_ADMIN = true;
	for (var i = 0; i < userCtx.roles; i++)
	  if (~secObj.admins.roles.indexOf(userCtx.roles[i])) IS_DB_ADMIN = true;

	if (!IS_DB_ADMIN) throw {
		'forbidden': 'This database is read-only'
	};

	if (newDoc && newDoc.uuid) {
		if (!newDoc.data_version) {
			throw {'forbidden': 'data_version is required'};
		}
		if ([12, 16].indexOf(newDoc.config.meta.mode_id) === -1) {
			throw {'forbidden': 'unaccepted mode id'};
		}
		// Test
	}
}