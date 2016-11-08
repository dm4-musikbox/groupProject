function channelService( socketFactory ) {
	let currentChannel;

	this.setCurrentChannel = ( channelId ) => {
			currentChannel = channelId;
	};

	this.createChannel = ( channel ) => {
			// create channel on database
			// for collaborators, add them to admin array
			// for listeners, add them to members array
			// add channel to all users' channels array
	};

	this.updateChannel = ( channel ) => {

	};

	this.enterChannel = ( channelId, userName ) => {
		const data =
				{
						userName
          	, channelId
				};
		socketFactory.emit( "enter channel", data );
	};

	this.leaveChannel = ( channelId, userName ) => {
		const data =
				{
						userName
          	, channelId
				};
		socketFactory.emit( "leave channel", data );
	};

	this.subscribeToChannel = ( channelId, userId ) => {
		const data =
				{
						userId
            , channelId
				};
		socketFactory.emit( "subscribe to channel", data );
	};

	this.unsubscribeFromChannel = ( channelId, userId ) => {
		const data =
				{
						userId
            , channelId
				};
		socketFactory.emit( "unsubscribe from channel", data );
	};
}

export default channelService;
