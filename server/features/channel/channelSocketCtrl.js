const mongoose = require( "mongoose" );
const Channel = require( "./Channel.js" );
const User = require( "./../user/User.js" );
const Message = require( "./../message/Message.js" );
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
		, deleteChannel( data, io ) {
				let channelId = data.channelId;
				console.log( channelId );
				Channel.findOneAndRemove( { _id: channelId }, ( err, response ) => {
						io.to( channelId ).emit( "channel deleted", response );
				} );
				//  Channel
				//  		.findOne( { _id: channelId } )
				//  		.exec( ( err, channel ) => {
				// 			 if ( err ) {
				// 				 return res.status( 400 ).send( err );
				// 			 }
				// 			 console.log( channel );
				// 				channel.genres.forEach( genre => {
				// 						Genre.findOneAndUpdate( { displayName: genre }, { $pull: { channels: channelId } } );
				// 				} );
				 //
				// 				channel.channelMessages.forEach( message => {
				// 						Message.findByIdAndRemove( message._id );
				// 				} );
				 //
				// 				channel.channelRecordings.forEach( recording => {
				// 						Recording.findByIdAndRemove( recording._id );
				// 				} );
				 //
				// 				channel.admins.forEach( admin => {
				// 						User.findById( admin._id, ( err, user ) => {
				// 								if ( err ) throw err;
				// 								for ( let i = user.adminInChannels.length - 1; i >= 0 ; i-- ) {
				// 										if ( user.adminInChannels[ i ].channel._id.toString() === channelId.toString() ) {
				// 												user.adminInChannels.splice( i, 1 );
				// 										}
				// 								}
				// 								let userToSave = user;
				// 								userToSave.save( ( err, user ) => {
				// 										console.log( 'channel deleted from admin', user );
				// 								} );
				// 						} );
				// 				} );
				 //
				// 				channel.members.forEach( member => {
				// 						User.findById( member._id, ( err, user ) => {
				// 								if ( err ) throw err;
				// 								for ( let i = user.memberInChannels.length - 1; i >= 0; i-- ) {
				// 										if ( user.memberInChannels[ i ].channel._id.toString() === channelId.toString() ) {
				// 												user.memberInChannels.splice( i, 1 );
				// 										}
				// 								}
				// 								let userToSave = user;
				// 								userToSave.save( ( err, user ) => {
				// 										console.log( 'channel deleted from member', user );
				// 								} );
				// 						} );
				// 				} );
				 //
				// 				channel.invitedAsAdmin.forEach( admin => {
				// 						console.log( admin );
				// 						User.findById( admin, ( err, user ) => {
				// 								if ( err ) throw err;
				// 								console.log( user.invitedAsAdmin, channelId );
				// 								for ( let i = user.invitedAsAdmin.length - 1; i >= 0; i-- ) {
				// 										if ( user.invitedAsAdmin[ i ].channel._id.toString() === channelId.toString() ) {
				// 												user.invitedAsAdmin.splice( i, 1 );
				// 										}
				// 								}
				// 								let userToSave = user;
				// 								userToSave.save( ( err, user ) => {
				// 										console.log( 'channel deleted from invitedAsAdmin', user );
				// 								} );
				// 						} );
				// 				} );
				// 				channel.invitedAsMember.forEach( member => {
				// 						console.log( member );
				// 						User.findById( member, ( err, user ) => {
				// 								if ( err ) throw err;
				// 								console.log( user.invitedAsMember, channelId );
				// 								for ( let i = user.invitedAsMember.length - 1; i >= 0; i-- ) {
				// 										if ( user.invitedAsMember[ i ].channel._id.toString() === channelId.toString() ) {
				// 												user.invitedAsMember.splice( i, 1 );
				// 										}
				// 								}
				// 								let userToSave = user;
				// 								userToSave.save( ( err, user ) => {
				// 										console.log( 'channel deleted from invitedAsMember', user );
				// 								} );
				// 						} );
				// 				} );
				 //
				// 				User.findById( channel.createdBy._id, ( err, user ) => {
				// 						if ( err ) throw err;
				// 						console.log( 'created by', user );
				// 						for ( let i = user.createdChannels.length - 1; i >= 0; i-- ) {
				// 								if ( user.createdChannels[ i ].channel._id.toString() === channelId.toString() ) {
				// 										user.createdChannels.splice( i, 1 );
				// 								}
				// 						}
				// 						let userToSave = user;
				// 						userToSave.save( ( err, user ) => {
				// 								console.log( 'channel deleted from creator', user );
				// 								// getUpdatedUser( user );
				// 						} );
				// 				} );
				// 			} )
					// .then( channel => {
					// 	Channel.findByIdAndRemove( channelId, ( err, response ) => {
					// 			io.to( channelId ).emit( "channel deleted", response );
					// 	} );
					// } )
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
