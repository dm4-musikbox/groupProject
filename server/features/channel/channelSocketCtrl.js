const mongoose = require( "mongoose" );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );

const activeChannels = {};

module.exports =
{
	enterChannel( data, io, socket ) {
		console.log( "enterChannel firing!" );

		const channelId = data.channelId;
		const userName = data.userName;
		let channelStatus;

		socket.join( channelId );

		if ( activeChannels.hasOwnProperty( channelId ) ) {
			activeChannels[ channelId ][ userName ] = socket;
			channelStatus =
			{
				channelId
							        	, users: Object.keys( activeChannels[ channelId ] )
			};
		}		else {
			activeChannels[ channelId ] = { [ userName ]: socket };
			channelStatus =
			{
				channelId
				              , activeUsers: Object.keys( activeChannels[ channelId ] )
			};
		}
		getChannelStatus( io, channelId, channelStatus );
	}

	, leaveChannel( data, io, socket ) {
			console.log( "leaveChannel firing!" );

			const channelId = data.channelId;
			const userName = data.userName;

			if ( activeChannels.hasOwnProperty( channelId ) ) {
				delete activeChannels[ channelId ][ userName ];

				if ( !Object.keys( activeChannels[ channelId ] ).length ) {
					delete activeChannels[ channelId ];
					getChannelStatus( io, channelId, { message: "everyone has left the room." } );
				}		else {
					const channelStatus = {
						channelId
					                      , activeUsers: Object.keys( activeChannels[ channelId ] )
					};
					getChannelStatus( io, channelId, channelStatus );
				}
			}
			socket.leave( channelId );
		}
		, addUserToChannel( data, io, socket ) {
				console.log( "addUserFromChannel firing!" );
				const channelId = data.channelId,
							userId = data.userId,
							userType = data.userType;

				let channelUpdateObj,
						userUpdateObj;

				if ( userType === 'member' ) {
						channelUpdateObj = { $addToSet: { members: userId } };
						userUpdateObj = { $addToSet: { memberInChannels: channelId } };
				}
				else if ( userType === 'admin' ) {
						channelUpdateObj = { $addToSet: { admins: userId } };
						userUpdateObj = { $addToSet: { adminInChannels: channelId } };
				}
				else if ( userType === 'invitedAsMember' ) {
						channelUpdateObj = { $addToSet: { invitedAsMember: userId } };
						userUpdateObj = { $addToSet: { invitedAsMember: channelId } };
				}
				else if ( userType === 'invitedAsAdmin' ) {
					channelUpdateObj = { $addToSet: { invitedAsAdmin: userId } };
					userUpdateObj = { $addToSet: { invitedAsAdmin: channelId } };
				}

				User.findOneAndUpdate( { _id: userId }, userUpdateObj, { new: true }, ( err, user ) => {
					if ( err ) {
						throw err;
					}
					console.log( user );
					getUpdatedUser( socket, userId, user );
				} );
				Channel.findOneAndUpdate( { _id: channelId }, channelUpdateObj, { new: true }, ( err, channel ) => {
					if ( err ) {
						throw( err );
					}
					getUpdatedChannel( io, channelId, channel );
				} );
		}

		, removeUserFromChannel( data, io, socket ) {
			console.log( "removeUserFromChannel firing!", data );
			const channelId = data.channelId,
						userId = data.userId,
						userType = data.userType;

			let channelUpdateObj,
					userUpdateObj;

			if ( userType === 'member' ) {
					channelUpdateObj = { $pull: { members: userId } };
					userUpdateObj = { $pull: { memberInChannels: channelId } };
			}
			else if ( userType === 'admin' ) {
					channelUpdateObj = { $pull: { admins: userId } };
					userUpdateObj = { $pull: { adminInChannels: channelId } };
			}
			else if ( userType === 'invitedAsMember' ) {
					channelUpdateObj = { $pull: { invitedAsMember: userId } };
					userUpdateObj = { $pull: { invitedAsMember: channelId } };
			}
			else if ( userType === 'invitedAsAdmin' ) {
					channelUpdateObj = { $pull: { invitedAsAdmin: userId } };
					userUpdateObj = { $pull: { invitedAsAdmin: channelId } };
			}

			User.findOneAndUpdate( { _id: userId }, userUpdateObj, { new: true }, ( err, user ) => {
				if ( err ) {
					throw err;
				}
				getUpdatedUser( socket, userId, user );
			} );

			Channel.findOneAndUpdate( { _id: channelId }, channelUpdateObj, { new: true }, ( err, channel ) => {
				if ( err ) {
					throw err;
				}
				getUpdatedChannel( io, channelId, channel );
			} );
		}
};

function getUpdatedUser( socket, userId, user ) {
	socket.emit( "get user", user );
}

function getUpdatedChannel( io, channelId, channel ) {
	io.to( channelId ).emit( "get channel", channel );
}

function getChannelStatus( io, channelId, channelStatus ) {
	io.to( channelId ).emit( "get status of channel", channelStatus );
}
