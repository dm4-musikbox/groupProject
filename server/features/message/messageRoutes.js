const messageCtrl = require( "./messageCtrl" );
const messageSocketCtrl = require( "./messageSocketCtrl" );

module.exports = ( app, io ) => {
		app.get( "/api/messages", messageCtrl.getMessages );
		app.delete( "/api/messages/:messageId/channels/:channelId", messageCtrl.deleteMessage );
		app.put( "/api/messages/:messageId", messageCtrl.updateMessage );
		app.post( "/api/messages/channel/:channelId", messageCtrl.postMessage );

		io.on( 'connection', socket => {
				socket.on( 'send and save message', data => {
						messageSocketCtrl.sendAndSaveMessage( data, io );
				} );

				socket.on( 'update message', data => {
						messageSocketCtrl.updateMessage( data, io );
				} );

				socket.on( 'delete message', data => {
						messageSocketCtrl.deleteMessage( data, io );
				} );
		} );
};
