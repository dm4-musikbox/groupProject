const recordingCtrl = require( './recordingCtrl' );
const recordingSocketCtrl = require( './recordingSocketCtrl' );

module.exports = ( app, io ) => {
		app.route( "/api/recordings" )
	        .get( recordingCtrl.getAllRecordings );

		app.route( "/api/recordings/:recording_id" )
	        .put( recordingCtrl.updateRecording );

		app.route( "/api/recordings/:recording_id/channels/:channel_id" )
	        .delete( recordingCtrl.deleteRecordingFromChannel );

		app.route( "/api/recordings/channels/:channel_id" )
					.post( recordingCtrl.addRecordingToChannel )
	        .delete( recordingCtrl.deleteAllRecordingsFromChannel );

		io.on( 'connection', socket => {
				socket.on( 'save recording', data => {
						recordingSocketCtrl.saveRecording( data, io );
				} );

				socket.on( 'update recording', data => {
						recordingSocketCtrl.updateRecording( data, io );
				} );

				socket.on( 'delete recording', data => {
						recordingSocketCtrl.deleteRecording( data, io );
				} );

				// on posting recording, copy recording object and broadcast only to target channel
				socket.on( 'post recording', ( recording ) => {
						console.log( 'Recording-to-post received ', recording );
				} );
		} );

};
