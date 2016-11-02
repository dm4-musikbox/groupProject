import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( $scope ) {
    const socket = io.connect();

    this.users = [];
    this.recordings = [];
    this.channel_id = '5818046d2643fcff7ad9aea1';
    this.channel;

    this.saveRecording = recording => {
        if ( recording ) {
            let data = {
                recording: recording
                , channel_id: this.channel_id
            };
            socket.emit( 'save recording', data );
        }
    };

    this.deleteRecording = recordingId => {
        if ( recordingId ) {
            let data = {
                recording_id: recordingId
                , channel_id: this.channel_id
            };
            socket.emit( 'delete recording', data );
        }
    };

    this.updateRecording = recording => {
        if ( recording ) {
            let data = {
                recording
                , channel_id: this.channel_id
            };
            socket.emit( 'update recording', data );
        }
    };

    socket.on( 'get recording', data => {
        this.recordings.push( data );
        $scope.$apply();
    } );

    /*****************************************************/

    this.sendAndSaveMessage = message => {
        if ( message ) {
            let data = {
                message: message
                , channel_id: this.channel_id
            };
            socket.emit( 'send and save message', data );
        }
    };

    this.updateMessage = ( message_id, message_update ) => {
        if ( message_id && message_update ) {
            let data = {
                message_update
                , message_id
                , channel_id: this.channel_id
            };
            console.log( data );
            socket.emit( 'update message', data );
        }
    };

    this.deleteMessage = messageId => {
        if ( messageId ) {
            let data = {
                message_id: messageId
                , channel_id: this.channel_id
            };
            socket.emit( 'delete message', data );
        }
    };

    socket.on( 'get channel', data => {
        this.channel = data;
        $scope.$apply();
    } );
}

const socketTestComponent = {
    template: socketTestHtml
    , controller: socketTestCtrl
}

export default socketTestComponent;
