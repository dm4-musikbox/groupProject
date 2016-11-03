function recordingService( socketFactory ) {
    this.updateRecording = ( recording, channelId ) => {
        let data = {
          recording
          , channelId: channelId
        };
        socketFactory.emit( 'update recording', data );
    };

    this.deleteRecording = ( recordingId, channelId )  => {
        let data = {
            recordingId: recordingId
            , channelId: channelId
        };
        socketFactory.emit( 'delete recording', data );
    };

}

export default recordingService;
