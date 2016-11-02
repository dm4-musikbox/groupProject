const Recording = require( "./Recording" );
const User = require( "./../user/User" );
const Channel = require( "./../channel/Channel" );

module.exports = {
    saveRecording( data, io ) {
        console.log( 'saveRecording firing' );
        const recording = data.recording;
        const channel_id = data.channel_id;
        // const channelUpdate = { $push: { channelRecordings: recording._id } };

        new Recording( data.recording ).save( ( err, recording ) => {
            if ( err ) {
                throw err;
            }
            io.sockets.emit( 'get recording', recording );
            Channel.findByIdAndUpdate( channel_id, { $push: { channelRecordings: recording._id } }, { new: true } )
                .populate( 'channelMessages channelRecordings' )
                .exec( ( err, channel ) => {
                    if ( err ) {
                      throw err;
                    }
                    getUpdatedChannel( channel, io );
                } );
        } );
    }

    , deleteRecording( data, io ) {
        const recording = data.recording;
        const channel_id = data.channel_id;

        Recording.findByIdAndRemove( data.recording_id, ( err, response ) => {
          if ( err ) {
             throw err;
          }
          console.log( response );
          Channel.findByIdAndUpdate( channel_id, { $pull: { channelRecordings: data.recording_id } }, { new: true } )
              .populate( 'channelMessages channelRecordings' )
              .exec( ( err, channel ) => {
                  if ( err ) {
                    throw err;
                  }
                  getUpdatedChannel( channel, io );
              } );
        } );
    }

    , updateRecording( data, io ) {
        Recording.findByIdAndUpdate( data.recording._id, { $set: { description: data.recording.description } }, { new: true }, ( err, recording ) => {
          if ( err ) {
              throw err;
          }
          Channel.findById( data.channel_id )
              .populate( 'channelMessages channelRecordings' )
              .exec( ( err, channel ) => {
                if ( err ) {
                  throw err;
                }
                getUpdatedChannel( channel, io );
              } );
        } );
    }
}

function updateChannel( channel_id, io, update ) {
    console.log( update );
    Channel.findByIdAndUpdate( channel_id, update, { new: true } )
        .populate( 'channelMessages channelRecordings' )
        .exec( ( err, channel ) => {
            if ( err ) {
              throw err;
            }
            getUpdatedChannel( channel, io );
        } );
}

function getUpdatedChannel( channel, io ) {
    return io.sockets.emit( 'get channel', channel );
}
