const mongoose = require( "mongoose" );

const Message = require( "./../message/Message" );
const Channel = require( "./../channel/Channel" );

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
                .findOneAndUpdate( { _id: channelId }, { $push: { channelMessages: message._id } }, { new: true } )
                .exec( ( err, channel ) => {
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
	const messageId = data.messageId;
	const messageContent = data.message.content;

	Message.findByIdAndUpdate( messageId, { $set: { content: messageContent } }, { new: true }, ( err, message ) => {
		if ( err ) {
			throw err;
		}
		console.log( "Updated message is ", message );
		Channel
                .findOne( { _id: channelId } )
                .exec( ( err, channel ) => {
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
		Channel
                .findOneAndUpdate( { _id: channelId }, { $pull: { channelMessages: messageId } }, { new: true } )
                .exec( ( err, channel ) => {
	if ( err ) {
		throw err;
	}
	getUpdatedChannel( channelId, io, channel );
} );
	} );
}
};

function getUpdatedChannel( channelId, io, channel ) {
	io.to( channelId ).emit( "get channel", channel );
    // io.sockets.emit( 'get channel', channel );
}
