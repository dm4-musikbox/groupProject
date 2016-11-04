const Channel = require( "./Channel.js" );
const Genre = require( "./../genre/Genre.js" );

module.exports = {
	findOrCreateChannel( req, res ) {
		const channel = req.body.channel;
		const user = req.body.user;

		channel.admins = [ user._id ];
		channel.members = [ user._id ];

		Channel.findOrCreate( { channel: channel.name }, channel, ( err, channel ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}

			if ( channel.type === 'public' ) {
					for ( let i = 0; i < channel.genres.length; i++ ) {
							Genre.findOneAndUpdate( { name: channel.genres[ i ] }, { $addToSet: { channels: channel._id } }, { new: true }, ( err, genre ) => {
									if ( err ) {
											return res.status( 500 ).json( err );
									}
									console.log( 'Channel added to genre ', genre );
							} );
					}
			}
			if ( channel.channelRecordings !== [] || channel.channelMessages !== [] ) {
					Channel
								.findOne( { _id: channel._id } )
								.populate( "channelRecordings channelMessages" )
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
		} );
	}
	  , getChannels( req, res ) {
			Channel
					.find()
					.populate( "channelRecordings channelMessages" )
					.exec( ( err, channels ) => {
						if ( err ) {
							return res.status( 500 ).json( err );
						}
						return res.status( 200 ).json( channels );
					} );
	}
	 , getChannelById( req, res ) {
			Channel.findOne( { _id: req.params.channel_id }, ( err, channel ) => {
				if ( err ) {
					return res.status( 400 ).send( err );
				}
				return res.status( 200 ).json( channel );
			} );
	}
	 , updateChannel( req, res ) {
			Channel.findOneAndUpdate( { _id: req.params.channel_id }, req.body, { new: true }, ( err, response ) => {
				if ( err ) {
					return res.status( 400 ).send( err );
				}
				return res.status( 200 ).json( response );
			} );
	}
	 , deleteChannel( req, res ) {
			Channel.findByIdAndRemove( req.params.channel_id, ( err, response ) => {
				if ( err ) {
					return res.status( 400 ).send( err );
				}
				return res.status( 200 ).json( response );
			} );
	}
	, addGenreToChannel( req, res ) {
		 Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $push: { genres: req.params.genre } }, { new: true }, ( err, channel ) => {
			 if ( err ) {
				 return res.status( 400 ).send( err );
			 }
			 console.log( channel );
			 return res.status( 200 ).json( channel );
		 } );
 }
	, deleteGenreFromChannel( req, res ) {
		 Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $pull: { genres: req.params.genre } }, { new: true }, ( err, response ) => {
			 if ( err ) {
				 return res.status( 400 ).send( err );
			 }
			 return res.status( 200 ).json( response );
		 } );
 }
};
