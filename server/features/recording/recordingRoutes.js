const Recording = require( "./Recording" );
const Channel = require( "./../channel/Channel" );

module.exports = ( app, io ) => {
	io.on( 'connection', socket => {
			// on receiving recording, upload recording to cloud, then store recording object with url in database
			socket.on( 'save recording', ( data ) => {
					console.log( 'Recording-to-save received ', data );
					new Recording( data.recording ).save( ( err, recording ) => {
							if ( err ) {
									throw err;
							}
							io.sockets.emit( 'get recording', recording );
							Channel.findByIdAndUpdate( data.channel_id, { $push: { channelRecordings: recording._id } }, { new: true } )
								.populate( 'channelRecordings' )
								.exec( ( err, channel ) => {
									if ( err ) {
										throw err;
									}
									getUpdatedChannel( channel );
								} );
					} );
			} );
			// on receiving recording id, delete recording from recordings collection and recording id from channel
			socket.on( 'delete recording', ( data ) => {
					Recording.findByIdAndRemove( data.recording_id, ( err, response ) => {
						if ( err ) {
							 throw err;
						}
						console.log( response );

						Channel.findByIdAndUpdate( data.channel_id, { $pull: { channelRecordings: data.recording_id } }, { new: true } )
								.populate( 'channelRecordings' )
								.exec( ( err, channel ) => {
									if ( err ) {
										throw err;
									}
									getUpdatedChannel( channel );
								} );
					} );
			} );

			socket.on( 'update recording', ( data ) => {
					Recording.findByIdAndUpdate( data.recording._id, { $set: { description: data.recording.description } }, { new: true }, ( err, recording ) => {
						if ( err ) {
								throw err;
						}
						Channel.findById( data.channel_id )
								.populate( 'channelRecordings' )
								.exec( ( err, channel ) => {
									if ( err ) {
										throw err;
									}
									getUpdatedChannel( channel );
								} );
					} );
			} );

			// on posting recording, copy recording object and broadcast only to target channel
			socket.on( 'post recording', ( recording ) => {
					console.log( 'Recording-to-post received ', recording );
			} );

			function getUpdatedChannel( channel ) {
					return io.sockets.emit( 'get channel', channel );
			}
	} );

	// app.route( "/api/recordings" )
  //       .get( recordingCtrl.getAllRecordings );
	//
	// app.route( "/api/recordings/:recording_id" )
  //       .put( recordingCtrl.updateRecording );
	//
	// app.route( "/api/recordings/:recording_id/channels/:channel_id" )
  //       .delete( recordingCtrl.deleteRecordingFromChannel );
	//
	// app.route( "/api/recordings/channels/:channel_id" )
	// 			.post( recordingCtrl.addRecordingToChannel )
  //       .delete( recordingCtrl.deleteAllRecordingsFromChannel );

};
