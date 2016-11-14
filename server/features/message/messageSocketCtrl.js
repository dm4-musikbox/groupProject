const mongoose = require( "mongoose" );

const Message = require( "./../message/Message" );
const Channel = require( "./../channel/Channel" );
const channelSocketCtrl = require( "./../channel/channelSocketCtrl" );
const userSocketCtrl = require( "./../user/userSocketCtrl" );

module.exports = {
	sendAndSaveMessage( data, io ) {
		console.log( "sendAndSaveMessage firing!" );
		const message = data.message;
		const channelId = data.channelId;

		new Message( message ).save( ( err, message ) => {
			if ( err ) {
				throw err;
			}
			Channel
				      .findOneAndUpdate( { _id: channelId }, { $push: { channelMessages: message._id } }, { new: true }, ( err, channel ) => {
					if ( err ) {
						throw err;
					}
					getUpdatedChannel( channelId, io, channel );
				} );
		} );
	}

	, updateMessage( data, io ) {
		console.log( "updateMessage firing!" );

		const channelId = data.channelId;
		const messageId = data.message._id;
		const messageContent = data.message.content;

		Message.findByIdAndUpdate( messageId, { $set: { content: messageContent, timestamp: Date.now() } }, { new: true }, ( err, message ) => {
			if ( err ) {
				throw err;
			}
			console.log( "Updated message is ", message );
			Channel
	        .findOne( { _id: channelId }, ( err, channel ) => {
		if ( err ) {
			throw err;
		}
		getUpdatedChannel( channelId, io, channel );
	} );
		} );
	}

	, deleteMessage( data, io ) {
		const messageId = data.messageId;
		const channelId = data.channelId;

		Message.findByIdAndRemove( messageId, ( err, response ) => {
			if ( err ) {
				throw err;
			}
			console.log( "Removed message! ", response );
			Channel.findOneAndUpdate( { _id: channelId }, { $pull: { channelMessages: messageId } }, { new: true }, ( err, channel ) => {
				if ( err ) {
					throw err;
				}
				getUpdatedChannel( channelId, io, channel );
			} );
		} );
	}
};

function getUpdatedChannel( channelId, io, channel ) {
	sendNotifications( channel );
	io.to( channelId ).emit( "get channel", channel );
}

function sendNotifications( channel ) {
	let activeUsersInChannel = channelSocketCtrl.getActiveUsersInChannel( channel._id );
	let allActiveUsers = channelSocketCtrl.getAllActiveUsers();
	let inactiveMembers = [];
	let inactiveAdmins = [];

	for ( let i = 0; i < channel.members.length; i++ ) {
			if ( !activeUsersInChannel.hasOwnProperty( channel.members[ i ].fullName ) ) {
					inactiveMembers.push( channel.members[ i ] );
			}
	}
	for ( let i = 0; i < channel.admins.length; i++ ) {
			if ( !activeUsersInChannel.hasOwnProperty( channel.admins[ i ].fullName ) ) {
					inactiveAdmins.push( channel.admins[ i ] );
			}
	}

	inactiveAdmins.forEach( admin => {
		const data = {};
		// data.user = admin;
		data.user = admin;
		data.userType = 'admin';
		data.channel = channel;
		data.setTo = true;

		if ( allActiveUsers.hasOwnProperty( admin.fullName ) ) {
			let socket = allActiveUsers[ admin.fullName ].socket;
			userSocketCtrl.setIsUpdatedProp( data, socket );
		}
		else {
			userSocketCtrl.setIsUpdatedProp( data )
		}
	} );

	inactiveMembers.forEach( member => {
		const data = {};
		// data.user = member;
		data.user = member;
		data.userType = 'member';
		data.channel = channel;
		data.setTo = true;
		if ( allActiveUsers.hasOwnProperty( member.fullName ) ) {
			let socket = allActiveUsers[ member.fullName ].socket;
			userSocketCtrl.setIsUpdatedProp( data, socket );
		}
		else {
			userSocketCtrl.setIsUpdatedProp( data );
		}
	} );

}
