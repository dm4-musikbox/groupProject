const recordingCtrl = require( './recordingCtrl' );
const recordingSocketCtrl = require( './recordingSocketCtrl' );

module.exports = ( app, binaryServer, io ) => {
		app.route( "/api/recordings" )
	        .get( recordingCtrl.getAllRecordings );

		app.route( "/api/recordings/:recording_id" )
	        .put( recordingCtrl.updateRecording );

		app.route( "/api/recordings/:recording_id/channels/:channel_id" )
	        .delete( recordingCtrl.deleteRecordingFromChannel );

		app.route( "/api/recordings/channels/:channel_id" )
					.post( recordingCtrl.addRecordingToChannel )
	        .delete( recordingCtrl.deleteAllRecordingsFromChannel );

		binaryServer.on( 'connection', client => {
				client.on( 'stream', ( stream, meta ) => {
						// rewrite with switch
						if ( meta.type === 'audio' ) {
								recordingSocketCtrl.createRecording( client, stream, meta );
						}
						else if ( meta.type === 'upload-to-S3' ) {
								recordingSocketCtrl.uploadRecordingToS3( client, stream, meta );
						}
				} );
		} );

};
