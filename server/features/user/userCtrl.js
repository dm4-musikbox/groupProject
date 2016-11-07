const User = require( "./User.js" );

module.exports = {
	findOrCreateUser( req, res ) {

		console.log( req.bodyb );
		const user = {
			authId: req.user.user_id
			, name: req.user.name
			, firstName: req.user.given_name
			, lastName: req.user.family_name
			, email: req.user.email
			, photo: req.user.picture
		}




		User.findOrCreate( { authId: req.user.user_id }, user, ( err, user ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			console.log("nuts");
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
		User.findOneAndUpdate( { _id: req.params.id }, req.body, { new: true }, ( err, response ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( response );
		} );
	}
	 , deleteUser( req, res ) {
		User.findByIdAndRemove( req.params.id, req.body, ( err, response ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 200 ).json( response );
		} );
	}
};
