const User = require( "./User.js" );

module.exports = {
	getUsers( req, res ) {
		User.find( ( req.query ), ( err, users ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 500 ).json( users );
		} );
	}
  , getUserById( req, res ) {
	User.findById( req.params.id, ( err, user ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( user );
	} );
}
  , updateUser( req, res ) {
	User.findByIdAndUpdate( req.params.id, req.body, ( err, response ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( response );
	} );
}
  , deleteUser( req, res ) {
    // if( !req.params.id ){
    //   return res.status( 400 ).send( "Navigate to User you want to delete" )
    // }
	User.findByIdAndRemove( req.params.id, req.body, ( err, response ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( response );
	} );
}
};
