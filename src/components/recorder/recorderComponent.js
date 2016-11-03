import recorderHtml from './recorder-component-tmpl.html';

function recorderCtrl( recorderService, socketFactory ) {
    this.setCurrentUser = ( userId ) => {
      recorderService.setCurrentUser( userId );
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

    this.uploadRecordingToS3 = ( recordingData, user_id ) => {
        let data = {
            recording: this.recordingData
            , user_id: this.userId
        };
        socketFactory.emit( 'upload recording to S3', data );
    };

}

const recorderComponent = {
    bindings: {
        channelId: '<'
        , userId: '<'
    }
    , template: recorderHtml
    , controller: recorderCtrl
}

export default recorderComponent;
