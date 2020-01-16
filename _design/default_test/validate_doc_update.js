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
	if (newDoc) {
	    if (newDoc.uuid && !newDoc.data_version) {
	        throw {'bad_request': 'data_version is required'};
	    }
	}
}