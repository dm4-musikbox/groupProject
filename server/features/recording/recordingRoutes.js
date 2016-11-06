const recordingCtrl = require( "./recordingCtrl" );

module.exports = app => {
	app.route( "/api/recordings" )
	        .get( recordingCtrl.getAllRecordings );

	app.route( "/api/recordings/:recording_id/channels/:channel_id" )
					.put( recordingCtrl.updateRecording )
	        .delete( recordingCtrl.deleteRecordingFromChannel );

	app.route( "/api/recordings/channels/:channel_id" )
					.post( recordingCtrl.addRecordingToChannel )
	        .delete( recordingCtrl.deleteAllRecordingsFromChannel );

	app.route( "/api/recordings/sign-s3" )
					.get( recordingCtrl.getSignedRequestFromS3 );
};
