const Channel = require( "./Channel.js" );

module.exports = {
	getChannels( req, res ) {
		Channel.find( ( req.query ), ( err, channels ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			return res.status( 500 ).json( channels );
		} );
	}
  , getChannelById( req, res ) {
	Channel.findById( req.params.id, ( err, channel ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( channel );
	} );
}
  , getChannelsByGenre( req, res ) {

}
  , updateChannel( req, res ) {
	Channel.findByIdAndUpdate( req.params.id, req.body, ( err, reponse ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( response );
	} );
}
  , deleteChannel( req, res ) {
	Channel.findByIdAndRemove( req.params.id, req.body, ( err, response ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 500 ).json( response );
	} );
}
};
