function messageService( socketFactory ) {
    this.sendAndSaveMessage = ( message, channelId ) => {
        let data = {
            message
            , channelId: channelId
        };
        socketFactory.emit( 'send and save message', data );
    };

    this.updateMessage = ( messageId, message, channelId ) => {
        let data = {
            message
            , messageId: messageId
            , channelId: channelId
        };
        console.log( data );
        socketFactory.emit( 'update message', data );
    };

    this.deleteMessage = ( messageId, channelId ) => {
        let data = {
            messageId: messageId
            , channelId: channelId
        };
        socketFactory.emit( 'delete message', data );
    };
}

export default messageService;
