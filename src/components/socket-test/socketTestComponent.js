import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( channelService, messageService, recordingService, socketFactory ) {
    this.users = [];
    this.recordings = [];
    this.userName = 'Andrew Plan'
    this.userId = '58196bc83a5bd823fca47594';
    this.channelId = '5818046d2643fcff7ad9aea1';
    this.channel;
    this.channelStatus;

    this.updateRecording = ( recording ) => {
        recordingService.updateRecording( recording, this.channelId );
    };

    this.deleteRecording = ( recording ) => {
        recordingService.deleteRecording( recording, this.channelId );
    };

    /*****************************************************/

    this.sendAndSaveMessage = message => {
        messageService.sendAndSaveMessage( message, this.channelId );
    };

    this.updateMessage = ( messageId, message ) => {
        messageService.updateMessage( messageId, message, this.channelId );
    };

    this.deleteMessage = messageId => {
        messageService.deleteMessage( messageId, this.channelId );
    };

    /**************************************************/

    this.enterChannel = ( channelId, userId, userName ) => {
        channelService.enterChannel( this.channelId, this.userId, this.userName );
    };

    this.leaveChannel = ( channelId, userId, userName ) => {
        channelService.leaveChannel( this.channelId, this.userId, this.userName );
    };

    this.subscribeToChannel = ( channelId, userId ) => {
        channelService.subscribeToChannel( this.channelId, this.userId );
    };

    this.unsubscribeFromChannel = ( channelId, userId ) => {
        channelService.unsubscribeFromChannel( this.channelId, this.userId );
    };

    socketFactory.on( 'get channel', data => {
        this.channel = data;
        console.log( 'get channel received! channel is ', data );
    } );

    socketFactory.on( 'get status of channel', data => {
        this.channelStatus = data;
    } );

    /**************************************************/

    this.$onDestroy = () => {
        socketFactory.removeAllListeners();
    };
}

const socketTestComponent = {
    template: socketTestHtml
    , controller: socketTestCtrl
}

export default socketTestComponent;
