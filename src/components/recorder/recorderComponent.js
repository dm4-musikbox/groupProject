import recorderHtml from './recorder-component-tmpl.html';

function recorderCtrl( recorderService, socketFactory ) {
    this.$onChanges = ( changes ) => {
        console.log( changes );
        recorderService.setCurrentUserAndChannel( changes.userId.currentValue, changes.userName.currentValue, changes.channelId.currentValue );
    };

    this.startRecording = () => {
        return recorderService.startRecording();
    };

    this.stopRecording = () => {
        return recorderService.stopRecording();
    };

    this.restartRecording = () => {
        return recorderService.restartRecording();
    };

    this.uploadRecordingToS3 = () => {
        return recorderService.uploadRecordingToS3( this.recordingData, this.userId );
    };

    socketFactory.on( 'get recording preview', data => {
        console.log( data );
        this.recordingData = data;
    } );

    socketFactory.on( 'get S3 data', data => {
        this.s3Data = data;
        this.data = {
            userId: this.userId
            , channelId: this.channelId
            , recording: {
                createdBy: this.userId
                , description: ''
                , s3ETag: data.ETag
                , s3Location: data.Location
                , s3Bucket: data.Bucket
                , s3Key: data.Key
            }
        }
        socketFactory.emit( 'save recording', this.data );
    } );

    this.$onDestroy = () => {
        socketFactory.removeAllListeners();
    };
}

const recorderComponent = {
    bindings: {
        channelId: '<'
        , userId: '<'
        , userName: '<'
    }
    , template: recorderHtml
    , controller: recorderCtrl
}

export default recorderComponent;
