function messageService( socketFactory ) {
	this.sendAndSaveMessage = ( message, channelId ) => {
		const data = {
			message
            , channelId
		};
		socketFactory.emit( "send and save message", data );
	};

	this.updateMessage = ( message, channelId ) => {
		const data = {
			message
            , channelId
		};
		socketFactory.emit( "update message", data );
	};

	this.deleteMessage = ( messageId, channelId ) => {
		console.log(messageId);
		console.log(channelId);
		const data = {
			messageId
            , channelId
		};
		socketFactory.emit( "delete message", data );
	};
}

export default messageService;
