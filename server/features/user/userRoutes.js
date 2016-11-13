const userCtrl = require( "./userCtrl.js" );
const userSocketCtrl = require( "./userSocketCtrl.js" );

module.exports = ( app, io ) => {
	app.get( "/api/users", userCtrl.getUsers );
	app.get( "/api/users/find", userCtrl.findSpecificUsers );
	app.get( "/api/users/:id", userCtrl.getUserById );
	app.post( "/api/users", userCtrl.findOrCreateUser );
	app.put( "/api/users/:id", userCtrl.updateUser );
	app.delete( "/api/users/:id", userCtrl.deleteUser );

	io.on( 'connection', socket => {
			socket.on( 'set isUpdated on channel', data => {
					userSocketCtrl.setIsUpdatedProp( data, socket );
			} );
	} );
};
