const messageCtrl = require( "./messageCtrl" );


module.exports = ( app ) => {
	app.get( "/api/messages", messageCtrl.getMessages );
	app.delete( "/api/messages/:messageId/channels/:channelId", messageCtrl.deleteMessage );
	app.put( "/api/messages/:messageId", messageCtrl.updateMessage );
	app.post( "/api/messages/channel/:channelId", messageCtrl.postMessage );
};
