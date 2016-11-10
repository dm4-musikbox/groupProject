const messageCtrl = require( "./messageCtrl" );
const messageSocketCtrl = require( "./messageSocketCtrl" );

module.exports = ( app ) => {
	app.get( "/api/messages", messageCtrl.getMessages );
	app.delete( "/api/messages/:messageId/channels/:channelId", messageCtrl.deleteMessage );
	app.put( "/api/messages/:messageId", messageCtrl.updateMessage );
	app.post( "/api/messages/channels/:channelId", messageCtrl.postMessage );
};
