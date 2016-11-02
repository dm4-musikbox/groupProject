const Recording = require( "./Recording" );

module.exports = ( app, io ) => {
	io.on( 'connection', socket => {
			// on receiving recording, upload recording to cloud, then store recording object with url in database
			socket.on( 'save recording', ( recording ) => {
					console.log( 'Recording-to-save received ', recording );
					new Recording( recording ).save( ( err, recording ) => {
						if ( err ) {
							throw err;
						}
						io.sockets.emit( 'get recording', recording );
			} );

			// on posting recording, copy recording object and broadcast only to target channel
			socket.on( 'post recording', ( recording ) => {
					console.log( 'Recording-to-post received ', recording );
			} );
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
} );
};
