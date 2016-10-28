const recordingCtrl = require( './recordingCtrl' );

module.exports = app => {
    app.route( '/api/recordings' )
        .get( recordingCtrl.getAllRecordings )
        .post( recordingCtrl.addNewRecordingToChannel );

    app.route( '/api/recordings/:recording_id')
        // .get( recordingCtrl.getRecordingById )
        .delete( recordingCtrl.deleteRecordingFromChannel );

    app.route( '/api/recordings/:channel_id' )
        .get( recordingCtrl.getRecordingsByChannelId )
        .delete( recordingCtrl.deleteAllRecordingsByChannelId );
};
