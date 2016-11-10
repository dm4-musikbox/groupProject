const User = require( "./User.js" );

module.exports = {
	findOrCreateUser( req, res ) {
		console.log( "findOrCreateUser firing!" );
		User.findOrCreate( { authId: req.body.authId }, req.body, ( err, user ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( user );
		} );
	}
  , getUsers( req, res ) {
	User.find( ( req.query ), ( err, users ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 200 ).json( users );
	} );
}
	 , getUserById( req, res ) {
		User.findOne( { _id: req.params.id }, ( err, user ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( user );
		} );
	}
	 , updateUser( req, res ) {
		 	console.log( "updateUser firing!" );
		User.findOneAndUpdate( { _id: req.params.id }, { $set: req.body }, { new: true }, ( err, user ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( user );
		} );
	}
	 , deleteUser( req, res ) {
		User.findByIdAndRemove( req.params.id, req.body, ( err, user ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( user );
		} );
	}
};
