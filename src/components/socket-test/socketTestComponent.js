import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( channelService, messageService, recordingService, socketFactory ) {
    this.users = [];
    this.recordings = [];
    this.user = {};
    this.channel = {};
    this.channelStatus;

    this.userId;
    this.userName;
    this.channelId;

    this.setCurrentUserAndChannel = ( userId, userName, channelId ) => {
        if ( userId ) {
            this.userId = userId;
        }
        if ( userName ) {
            this.userName = userName;
        }
        if ( channelId ) {
            this.channelId = channelId;
        }
    };

    this.updateRecording = ( recording, channelId, userId ) => {
        recordingService.updateRecording( recording, channelId, userId );
    };

    this.deleteRecording = ( recording, channelId, userId ) => {
        recordingService.deleteRecording( recording, channelId, userId );
    };

    /*****************************************************/

    this.sendAndSaveMessage = ( message, channelId ) => {
        messageService.sendAndSaveMessage( message, channelId );
    };

    this.updateMessage = ( messageId, message, channelId ) => {
        messageService.updateMessage( messageId, message, channelId );
    };

    this.deleteMessage = ( messageId, channelId ) => {
        messageService.deleteMessage( messageId, channelId );
    };

    /**************************************************/

    this.enterChannel = ( channelId, userName ) => {
        channelService.enterChannel( channelId, userName );
    };

    this.leaveChannel = ( channelId, userName ) => {
        channelService.leaveChannel( channelId, userName );
    };

    this.subscribeToChannel = ( channelId, userId ) => {
        channelService.subscribeToChannel( channelId, userId );
    };

    this.unsubscribeFromChannel = ( channelId, userId ) => {
        channelService.unsubscribeFromChannel( channelId, userId );
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
