function channelService( socketFactory ) {
    this.enterChannel = ( channelId, userId ) => {
        let data = {
            userId: userId
            , channelId: channelId
        };
        socketFactory.emit( 'enter channel', data );
    };

    this.leaveChannel = ( channelId, userId ) => {
        let data = {
            userId: userId
            , channelId: channelId
        };
        socketFactory.emit( 'leave channel', data );
    };

    this.subscribeToChannel = ( channelId, userId ) => {
        let data = {
            userId: userId
            , channelId: channelId
        };
        socketFactory.emit( 'subscribe to channel', data );
    };

    this.unsubscribeFromChannel = ( channelId, userId ) => {
        let data = {
            userId: userId
            , channelId: channelId
        };
        socketFactory.emit( 'unsubscribe from channel', data );
    };
}

export default channelService;
