const mongoose = require( "mongoose" );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );
const Message = require( "./../message/Message.js" );
const Recording = require( "./../recording/Recording.js" );
const Genre = require( "./../genre/Genre.js" );

const activeChannels = {};
const activeUsers = {}

module.exports =
{
	enterApp( data, io, socket ) {
		let user = data.user;
		activeUsers[ user.fullName ] = {
			user,
			socket
		};
		console.log( Object.keys( activeUsers ) );
		socket.emit( 'app entered' );
	}

	, createChannel( data, io, socket ) {
		const channelToCreate = data;

		new Channel( channelToCreate ).save( ( err, channel ) => {
			if ( err ) throw err;

			console.log( 'channel created ', channel );
			let channelId = channel._id;

			if ( channel.type === "public" ) {
				for ( let i = 0; i < channel.genres.length; i++ ) {
					Genre.findOneAndUpdate( { displayName: channel.genres[ i ] }, { $addToSet: { channels: channelId } }, { new: true }, ( err, genre ) => {
						if ( err ) {
							return res.status( 500 ).json( err );
						}
					} );
				}
			}

			channel.invitedAsAdmin.forEach( admin => {
					// console.log( 'invitedAsAdmin', admin );
					User.findByIdAndUpdate( admin, { $addToSet: { invitedAsAdmin: { channel: channelId } } }, { new: true }, ( err, user ) => {
							// console.log( user );
							if ( err ) throw err;
							getUpdatedUser( user );
					} );
			} );
			channel.invitedAsMember.forEach( member => {
					User.findByIdAndUpdate( member, { $addToSet: { invitedAsMember: { channel: channelId } } }, { new: true }, ( err, user ) => {
							// console.log( user );
							if ( err ) throw err;
							getUpdatedUser( user );
					} );
			} );

			User.findOneAndUpdate( { _id: channel.createdBy }, { $addToSet: { createdChannels: { channel: channelId } } }, ( err, user ) => {
				if ( err ) throw err;
				User.findOneAndUpdate( { _id: channel.admins[ 0 ] }, { $addToSet: { adminInChannels: { channel: channelId } } }, ( err, user ) => {
					if ( err ) throw err;
					getUpdatedUser( user );
				} );
			} );

			socket.emit( 'channel created', channel );
		} );
	}

	, enterChannel( data, io, socket ) {
		console.log( "enterChannel firing!" );

		const channel = data.channel;
		const user = data.user;
		let channelStatus;

		socket.join( channel._id );

		if ( activeChannels.hasOwnProperty( channel._id ) ) {
			activeChannels[ channel._id ].activeUsers[ user.fullName ] = { socket, user };
		}
		else {
			activeChannels[ channel._id ] = {
					channel
					, activeUsers: { [ user.fullName ]: { socket, user } }
			};

		}
		channelStatus =	Object.assign( {}, activeChannels[ channel._id ] );
		for ( let prop in channelStatus.activeUsers ) {
			delete channelStatus.activeUsers[ prop ].socket;
		}
		getChannelStatus( io, channel._id, channelStatus );
	}

	, leaveChannel( data, io, socket ) {
			console.log( "leaveChannel firing!" );

			const channelId = data.channelId;
			const userFullName = data.userFullName;

			let channelStatus =	Object.assign( {}, activeChannels[ channelId ] );
			for ( let prop in channelStatus.activeUsers ) {
				delete channelStatus.activeUsers[ prop ].socket;
			}

			if ( activeChannels.hasOwnProperty( channelId ) ) {
				delete activeChannels[ channelId ].activeUsers[ userFullName ];

				if ( !Object.keys( activeChannels[ channelId ].activeUsers ).length ) {
					delete activeChannels[ channelId ];
					channelStatus = {};
					getChannelStatus( io, channelId, { message: "everyone has left the room." } );
				}
				else {
					getChannelStatus( io, channelId, channelStatus );
				}
			}
			socket.leave( channelId );
		}
		, addUserToChannel( data, io, socket ) {
				console.log( "addUserToChannel firing!", data );
				const channelId = data.channelId,
							userId = data.userId,
							userType = data.userType;

				let channelUpdateObj,
						userUpdateObj;

				if ( userType === 'member' ) {
						channelUpdateObj = { $addToSet: { members: userId } };
						userUpdateObj = { $addToSet: { memberInChannels: { channel: channelId } } };
				}
				else if ( userType === 'admin' ) {
						channelUpdateObj = { $addToSet: { admins: userId } };
						userUpdateObj = { $addToSet: { adminInChannels: { channel: channelId } } };
				}
				else if ( userType === 'invitedAsMember' ) {
						channelUpdateObj = { $addToSet: { invitedAsMember: userId } };
						userUpdateObj = { $addToSet: { invitedAsMember: { channel: channelId } } };
				}
				else if ( userType === 'invitedAsAdmin' ) {
					channelUpdateObj = { $addToSet: { invitedAsAdmin: userId } };
					userUpdateObj = { $addToSet: { invitedAsAdmin: { channel: channelId } } };
				}

				User.findOneAndUpdate( { _id: userId }, userUpdateObj, { new: true }, ( err, user ) => {
					if ( err ) {
						throw err;
					}
					getUpdatedUser( user );
				} );
				Channel.findOneAndUpdate( { _id: channelId }, channelUpdateObj, { new: true }, ( err, channel ) => {
					if ( err ) {
						throw( err );
					}
					getUpdatedChannel( io, channelId, channel );
				} );
		}

		, removeUserFromChannel( data, io, socket ) {
			console.log( "removeUserFromChannel firing!" );
			const channelId = data.channelId,
						user = data.user,
						userId = data.userId,
						userType = data.userType;

						console.log( data );

			let channelUpdateObj,
					userUpdateObj;

			if ( userType === 'member' ) {
					channelUpdateObj = { $pull: { members: userId } };
					userUpdateObj = { $pull: { memberInChannels: { channel: channelId } } };
			}
			else if ( userType === 'admin' ) {
					channelUpdateObj = { $pull: { admins: userId } };
					userUpdateObj = { $pull: { adminInChannels: { channel: channelId } } };
			}
			else if ( userType === 'invitedAsMember' ) {
					channelUpdateObj = { $pull: { invitedAsMember: userId } };
					userUpdateObj = { $pull: { invitedAsMember: { channel: channelId } } };
			}
			else if ( userType === 'invitedAsAdmin' ) {
					channelUpdateObj = { $pull: { invitedAsAdmin: userId } };
					userUpdateObj = { $pull: { invitedAsAdmin: { channel: channelId } } };
			}

			User.findOneAndUpdate( { _id: userId }, userUpdateObj, { new: true }, ( err, user ) => {
				if ( err ) {
					throw err;
				}
				getUpdatedUser( user );
			} );

			Channel.findOneAndUpdate( { _id: channelId }, channelUpdateObj, { new: true }, ( err, channel ) => {
				if ( err ) {
					throw err;
				}
				getUpdatedChannel( io, channelId, channel );
			} );
		}
		, deleteChannel( data, io, socket ) {
				let channelId = data.channelId;
				console.log( 'deleteChannel firing' );
				Channel.findOne( { _id: channelId }, ( err, channel ) => {
						if ( err ) throw err;

						User.findByIdAndUpdate( channel.createdBy._id, { $pull: { createdChannels: { channel: channelId } } }, { new: true }, ( err, user ) => {
								// console.log( user );
								getUpdatedUser( user );
						} );

						channel.genres.forEach( genre => {
								Genre.findOneAndUpdate( { displayName: genre }, { $pull: { channels: channel._id } } );
						} );
						channel.admins.forEach( admin => {
								User.findByIdAndUpdate( admin._id, { $pull: { adminInChannels: { channel: channelId } } }, { new: true }, ( err, user ) => {
										// console.log( user );
										getUpdatedUser( user );
								} );
						} );
						channel.members.forEach( member => {
								User.findByIdAndUpdate( member._id, { $pull: { memberInChannels: { channel: channelId } } }, { new: true }, ( err, user ) => {
										// console.log( user );
										getUpdatedUser( user );
								} );
						} );
						channel.channelMessages.forEach( message => {
								Message.findByIdAndRemove( message._id );
						} );
						channel.channelRecordings.forEach( recording => {
								Recording.findByIdAndRemove( recording._id );
						} );
						channel.invitedAsAdmin.forEach( admin => {
								// console.log( 'invitedAsAdmin', admin );
								User.findByIdAndUpdate( admin, { $pull: { invitedAsAdmin: { channel: channelId } } }, { new: true }, ( err, user ) => {
										// console.log( user );
										getUpdatedUser( user );
								} );
						} );
						channel.invitedAsMember.forEach( member => {
								User.findByIdAndUpdate( member, { $pull: { invitedAsMember: { channel: channelId } } }, { new: true }, ( err, user ) => {
										// console.log( user );
										getUpdatedUser( user );
								} );
						} );

						setTimeout( () => {
								console.log( 'waited 2000 ms' );
								Channel.findByIdAndRemove( channelId, ( err, response ) => {
										io.to( channelId ).emit( "channel deleted", response );
										socket.emit( "redirect channel creator upon channel deletion", response );
								} );
						}, 500 );
				} );
		 }
		 , disconnectUser( socket ) {
			 	for ( let channelProp in activeChannels ) {
						for ( let activeUserProp in activeChannels[ channelProp ] ) {
								if ( activeChannels[ channelProp ].activeUsers[ activeUserProp ].socket = socket ) {
										delete activeChannels[ channelProp ].activeUsers[ activeUserProp ];
								}
						}
						for ( let activeUserProp in activeChannels[ channelProp ] ) {
								if ( activeChannels[ channelProp ].activeUsers[ activeUserProp ].socket = socket ) {
										delete activeChannels[ channelProp ].activeUsers[ activeUserProp ];
								}
						}
				}

				for ( let prop in activeUsers ) {
						if ( activeUsers[ prop ].socket = socket ) {
								delete activeUsers[ prop ];
						}
				}
		 }
		 , getActiveUsersInChannel( channelId ) {
			 	console.log( channelId );
				return activeChannels[ channelId ].activeUsers;
		 }
		 , getAllActiveUsers() {
			 	return activeUsers;
		 }
};

function getUpdatedUser( user ) {
	console.log( user.fullName );
	if ( activeUsers.hasOwnProperty( user.fullName ) ) {
		let socket = activeUsers[ user.fullName ].socket;
		socket.emit( "get user", user );
	}
}

function getUpdatedChannel( io, channelId, channel ) {
	io.to( channelId ).emit( "get channel", channel );
}

function getChannelStatus( io, channelId, channelStatus ) {
	io.to( channelId ).emit( "get status of channel", channelStatus );
}
