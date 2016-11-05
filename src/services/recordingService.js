function recordingService( socketFactory ) {
	this.updateRecording = ( recording, channelId, userId ) => {
		recording.createdBy = userId;
		const data = {
			recording
          , channelId
		};
		socketFactory.emit( "update recording", data );
	};

	this.deleteRecording = ( recording, channelId, userId )  => {
		recording.createdBy = userId;
		const data = {
			recording
            , channelId
		};
		socketFactory.emit( "delete recording", data );
	};
}

export default recordingService;
