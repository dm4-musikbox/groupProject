const recordingCtrl = require( "./recordingCtrl" );

module.exports = ( app ) => {
	app.route( "/api/recordings" )
        .get( recordingCtrl.getAllRecordings );

	app.route( "/api/recordings/:recording_id" )
        .put( recordingCtrl.updateRecording );

	app.route( "/api/recordings/:recording_id/channels/:channel_id" )
        .delete( recordingCtrl.deleteRecordingFromChannel );

	app.route( "/api/recordings/channels/:channel_id" )
				.post( recordingCtrl.addRecordingToChannel )
        .delete( recordingCtrl.deleteAllRecordingsFromChannel );
};
