import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( $scope, socketFactory ) {
    this.users = [];
    this.recordings = [];
    this.userId = '58196bc83a5bd823fca47594';
    this.channelId = '5818046d2643fcff7ad9aea1';
    this.channel;
    this.channelStatus;

    this.saveRecording = recording => {
        if ( recording ) {
            let data = {
                recording: recording
                , channel_id: this.channelId
            };
            socketFactory.emit( 'save recording', data );
        }
    };

    this.deleteRecording = recordingId => {
        if ( recordingId ) {
            let data = {
                recording_id: recordingId
                , channel_id: this.channelId
            };
            socketFactory.emit( 'delete recording', data );
        }
    };

    this.updateRecording = recording => {
        if ( recording ) {
            let data = {
                recording
                , channel_id: this.channelId
            };
            socketFactory.emit( 'update recording', data );
        }
    };

    socketFactory.on( 'get recording', data => {
        this.recordings.push( data );
    } );

    /*****************************************************/

    this.sendAndSaveMessage = message => {
        if ( message ) {
            let data = {
                message: message
                , channel_id: this.channelId
            };
            socketFactory.emit( 'send and save message', data );
        }
    };

    this.updateMessage = ( message_id, message_update ) => {
        if ( message_id && message_update ) {
            let data = {
                message_update
                , message_id
                , channel_id: this.channelId
            };
            console.log( data );
            socketFactory.emit( 'update message', data );
        }
    };

    this.deleteMessage = messageId => {
        if ( messageId ) {
            let data = {
                message_id: messageId
                , channel_id: this.channelId
            };
            socketFactory.emit( 'delete message', data );
        }
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
    socketFactory.on( 'get recording preview', data => {
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

    /**************************************************/
    $scope.$on( '$destroy', event => {
        socket.removeAllListeners();
    } );
}

const socketTestComponent = {
    template: socketTestHtml
    , controller: socketTestCtrl
}

export default socketTestComponent;
