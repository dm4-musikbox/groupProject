const mongoose = require( 'mongoose' );

const Message = require( "./../message/Message" );
const Channel = require( "./../channel/Channel" );

module.exports = {
    sendAndSaveMessage( data, io ) {
        console.log( 'sendAndSaveMessage firing!', io );
        const message = data.message;
        const channel_id = data.channel_id;

        new Message( message ).save( ( err, message ) => {
            if ( err ) {
                throw err;
            }
            Channel
                .findByIdAndUpdate( channel_id, { $push: { channelMessages: message._id } }, { new: true } )
                .populate( "channelRecordings channelMessages" )
                .exec( ( err, channel ) => {
                    if ( err ) {
                        throw err;
                    }
                    getUpdatedChannel( channel_id, io, channel );
                } );
        } );
    }

    , updateMessage( data, io ) {
        const channel_id = data.channel_id;
        const message_id = data.message_id;
        const messageUpdate = data.message_update;

        Message.findByIdAndUpdate( message_id, { $set: messageUpdate }, { new: true } , ( err, message ) => {
            if ( err ) {
                throw err;
            }
            console.log( 'Updated message is ', message );
            Channel
                .findById( channel_id )
                .populate( "channelRecordings channelMessages" )
                .exec( ( err, channel ) => {
                    if ( err ) {
                        throw err;
                    }
                    getUpdatedChannel( channel_id, io, channel );
                } );
        } );
    }

    , deleteMessage( data, io ) {
        const message_id = data.message_id;
        const channel_id = data.channel_id;

        Message.findByIdAndRemove( message_id, ( err, response ) => {
            if ( err ) {
                throw err;
            }
            console.log( 'Removed message! ', response );
            Channel
                .findByIdAndUpdate( channel_id, { $pull: { channelMessages: message_id } }, { new: true } )
                .populate( "channelRecordings channelMessages" )
                .exec( ( err, channel ) => {
                    if ( err ) {
                        throw err;
                    }
                    getUpdatedChannel( channel_id, io, channel );
                } );
        } );
    }
};

function getUpdatedChannel( channel_id, io, channel ) {
    io.to( channel_id ).emit( 'get channel', channel );
    // io.sockets.emit( 'get channel', channel );
}
