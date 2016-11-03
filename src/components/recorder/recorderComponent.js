import recorderHtml from './recorder-component-tmpl.html';

function recorderCtrl( recordingService ) {
    this.startRecording = () => {
        return recordingService.startRecording();
    };

    this.stopRecording = () => {
        return recordingService.stopRecording();
    };

    this.restartRecording = () => {
        return recordingService.restartRecording();
    };

}

const recorderComponent = {
    template: recorderHtml
    , controller: recorderCtrl
}

export default recorderComponent;
