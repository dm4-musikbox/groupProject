function channelService( $http, ref, socketFactory ) {
	let currentChannel;

	this.setCurrentChannel = ( channelId ) => {
		currentChannel = channelId;
	};

	this.createChannel = ( channel ) => {
		console.log( channel );
		// return $http.post( `${ ref.url }/api/channels`, channel );
		let data = channel;
		socketFactory.emit( 'create channel', data );
	};

	this.getChannelById = ( channelId ) => {
		return $http
								.get( `${ ref.url }/api/channels/${ channelId }` )
								.then( channel =>	{
										return channel.data;
									}
								);
	};

	this.deleteChannel = ( channelId ) => {
		const data = {};
		data.channelId = channelId;
		socketFactory.emit( "delete channel", data );
	};

	this.enterChannel = ( channel, user ) => {
		const data =
			{
					channel
					, user
			};
		socketFactory.emit( "enter channel", data );
	};

	this.leaveChannel = ( channelId, userFullName ) => {
		const data =
			{
					channelId
					, userFullName
			};
		socketFactory.emit( "leave channel", data );
	};

	this.addUserToChannel = ( channelId, userId, userType ) => {
		const data =
			{
					channelId
					, userId
					, userType
			};
		socketFactory.emit( "add user to channel", data );
	};

	this.removeUserFromChannel = ( channelId, userId, userType ) => {
		const data =
			{
      		channelId
					, userId
					, userType
			};
		socketFactory.emit( "remove user from channel", data );
	};
}

export default channelService;
