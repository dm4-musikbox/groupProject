function messageService( socketFactory ) {
	this.sendAndSaveMessage = ( message, channelId ) => {
		const data = {
			message
            , channelId
		};
		console.log( data );
		socketFactory.emit( "send and save message", data );
	};

	this.updateMessage = ( messageId, message, channelId ) => {
		const data = {
			message
            , messageId
            , channelId
		};
		console.log( data );
		socketFactory.emit( "update message", data );
	};

	this.deleteMessage = ( messageId, channelId ) => {
		const data = {
			messageId
            , channelId
		};
		socketFactory.emit( "delete message", data );
	};
}

export default messageService;
