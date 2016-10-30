const userCtrl = require( "./userCtrl.js" );

module.exports = ( app ) => {
	app.get( "/api/users", userCtrl.getUsers );
	app.get( "/api/users/:id", userCtrl.getUserById );
	app.post( "/api/users", userCtrl.findOrCreateUser );
	app.put( "/api/users/:id", userCtrl.updateUser );
	app.delete( "/api/users/:id", userCtrl.deleteUser );
};
