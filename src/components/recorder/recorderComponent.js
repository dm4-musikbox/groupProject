import recorderHtml from "./recorder-component-tmpl.html";

function recorderCtrl( $scope, recorderService, socketFactory ) {
	this.$onChanges = ( changes ) => {
		recorderService.setCurrentUserAndChannel( changes.userId.currentValue, changes.userName.currentValue, changes.channelId.currentValue );
	};

	this.startRecording = () => {
		recorderService.startRecording();
	};

	this.stopRecording = () => {
		recorderService.stopRecording();
	};

	this.restartRecording = () => {
		recorderService.restartRecording();
	};

	this.uploadRecordingToS3 = () => {
		recorderService.uploadRecordingToS3( this.recordingData, this.userId, this.channelId );
	};

	socketFactory.on( "get recording preview", data => {
		this.recordingData = data;
	} );

	socketFactory.on( "get S3 data", data => {
		this.s3Data = data; // for debugging purposes only ( will display on view )
		this.data = {
		        userId: this.userId
            , channelId: this.channelId
            , recording: {
	createdBy: this.userId
                , description: ""
                , s3ETag: data.ETag
                , s3Location: data.Location
                , s3Bucket: data.Bucket
                , s3Key: data.Key
}
		};
		socketFactory.emit( "save recording", this.data );
	} );


	this.$onDestroy = () => {
		socketFactory.removeAllListeners();
	};
}

const recorderComponent = {
	bindings: {
		channelId: "<"
        , userId: "<"
        , userName: "<"
	}
    , template: recorderHtml
    , controller: recorderCtrl
};

export default recorderComponent;
