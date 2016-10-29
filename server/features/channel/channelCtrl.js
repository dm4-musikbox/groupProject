const Channel = require( "./Channel.js" );

module.exports = {
	findOrCreateChannel( req, res ) {

		let channel = req.body;

		Channel.findOrCreate( { channel: channel.name }, channel, ( err, channel ) => {
			if( err ){
				return res.status( 400 ).send( err );
			}
			if ( channel.channelRecordings !== [] || channel.channelMessages !== [] ) {
					Channel
							.findOne( { _id: channel._id } )
							.populate( 'channelRecordings channelMessages' )
							.exec( ( err, channel ) => {
									if ( err ) {
											return res.status( 500 ).json( err );
									}
									return res.status( 200 ).json( channel );
							} );
			}
			else {
					return res.status( 200 ).json( channel );
			}
		})
	}
	, getChannels( req, res ) {
		Channel
				.find()
				.populate( 'channelRecordings channelMessages' )
				.exec( ( err, channels ) => {
						if ( err ) {
								return res.status( 500 ).json( err );
						}
						return res.status( 200 ).json( channels );
				} );
	}
  , getChannelById( req, res ) {
	Channel.findById( req.params.id, ( err, channel ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 200 ).json( channel );
	} );
}
//   , getChannelsByGenre( req, res ) {
//
// }
  , updateChannel( req, res ) {
	Channel.findByIdAndUpdate( req.params.id, req.body, { new: true }, ( err, response ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 200 ).json( response );
	} );
}
  , deleteChannel( req, res ) {
	Channel.findByIdAndRemove( req.params.id, req.body, ( err, response ) => {
		if ( err ) {
			return res.status( 400 ).send( err );
		}
		return res.status( 200 ).json( response );
	} );
}
};
