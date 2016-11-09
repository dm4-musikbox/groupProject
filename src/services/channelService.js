function channelService( $http, ref, socketFactory ) {
	let currentChannel;

	this.setCurrentChannel = ( channelId ) => {
			currentChannel = channelId;
	};

	this.createChannel = ( channel ) => {
			channel.genres = channel.genres.split( ',' );
			if ( channel.invitedAsAdmin ) {
					channel.invitedAsAdmin = channel.invitedAsAdmin.split( ',' );
			}
			if ( channel.invitedAsMember ) {
					channel.invitedAsMember = channel.invitedAsMember.split( ',' );
			}
			console.log( channel );
			return $http
								.post( `${ ref.url }/api/channels`, channel )

	};

	this.getChannelById = ( channelId ) => {
			return $http
								.get( `${ ref.url }/api/channels/${ channelId }` )
								.then( channel =>
										{
												return channel.data;
										}
								);
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
