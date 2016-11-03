import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( messageService, recordingService, socketFactory ) {
    this.users = [];
    this.recordings = [];
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

    this.updateMessage = ( message ) => {
        messageService.updateMessage( message, this.channelId );
    };

    this.deleteMessage = messageId => {
        messageService.deleteMessage( messageId, this.channelId );
    };

    /**************************************************/

    this.enterChannel = ( channel_id, user_id ) => {
      // if ( channel_id && user_id ) {
          let data = {
              user_id: this.userId
              , channel_id: this.channelId
          };
          socketFactory.emit( 'enter channel', data );
      // }
    };

    this.leaveChannel = ( channel_id, user_id ) => {
      // if ( channel_id && user_id ) {
          let data = {
              user_id: this.userId
              , channel_id: this.channelId
          };
          socketFactory.emit( 'leave channel', data );
      // }
    };

    this.subscribeToChannel = ( channel_id, user_id ) => {
      // if ( channel_id && user_id ) {
          let data = {
              user_id: this.userId
              , channel_id: this.channelId
          };
          socketFactory.emit( 'subscribe to channel', data );
      // }
    };

    this.unsubscribeFromChannel = ( channel_id, user_id ) => {
      // if ( channel_id && user_id ) {
          let data = {
              user_id: this.userId
              , channel_id: this.channelId
          };
          socketFactory.emit( 'unsubscribe from channel', data );
      // }
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
