const Channel = require( "./Channel.js" );
const Genre = require( "./../genre/Genre.js" );
const User = require( "./../user/User.js" );

module.exports = {
	createChannel( req, res ) {
		const channelToCreate = req.body;

		new Channel( channelToCreate ).save( ( err, channel ) => {
			if ( err ) {
				return res.status( 400 ).send( err );
			}
			if ( channel.type === "public" ) {
				for ( let i = 0; i < channel.genres.length; i++ ) {
					Genre.findOneAndUpdate( { displayName: channel.genres[ i ] }, { $addToSet: { channels: channel._id } }, { new: true }, ( err, genre ) => {
						if ( err ) {
							return res.status( 500 ).json( err );
						}
						console.log( "Channel added to genre ", genre );
					} );
				}
			}
				// for collaborators, add them to admin array
			for ( let i = 0; i < channel.invitedAsAdmin.length; i++ ) {
				User.findOneAndUpdate( { _id: channel.invitedAsAdmin[ i ] }, { $set: { invitedAsAdmin: channel._id } } );
			}
				// for listeners, add them to members array
			for ( let i = 0; i < channel.invitedAsMember.length; i++ ) {
				User.findOneAndUpdate( { _id: channel.invitedAsMember[ i ] }, { $set: { invitedAsMember: channel._id } } );
			}
			User.findOneAndUpdate( { _id: channel.createdBy }, { $push: { createdChannels: channel._id } }, ( err, user ) => {
				if ( err ) {
					return res.status( 500 ).json( err );
				}
			} );

			return res.status( 200 ).json( channel );
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
	, getPublicChannels( req, res ) {
		Channel
					.find( { type: 'public' }, ( err, channels ) => {
							if ( err ) {
								return res.status( 500 ).json( err );
							}
							return res.status( 200 ).json( channels );
					} );
	}
	 , getChannelById( req, res ) {
		 console.log( "getChannelById firing!" );
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
	
	, deleteUserFromChannel( req, res ) {
		 Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $pull: { genres: req.params.genre } }, { new: true }, ( err, response ) => {
			 if ( err ) {
				 return res.status( 400 ).send( err );
			 }
			 return res.status( 200 ).json( response );
		 } );
	}
	, addGenreToChannel( req, res ) {
		 Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $addToSet: { genres: req.params.genre } }, { new: true }, ( err, channel ) => {
			 if ( err ) {
				 return res.status( 400 ).send( err );
			 }
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
