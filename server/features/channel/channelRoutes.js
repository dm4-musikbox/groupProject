const channelCtrl = require( "./channelCtrl.js" );
const channelSocketCtrl = require( "./channelSocketCtrl.js" );

module.exports = ( app, io ) => {
		app.get( "/api/channels", channelCtrl.getChannels );
		app.get( "/api/channels/:id", channelCtrl.getChannelById );
		app.put( "/api/channels", channelCtrl.findOrCreateChannel );
		app.put( "/api/channels/:id", channelCtrl.updateChannel );
		app.delete( "/api/channels/:id", channelCtrl.deleteChannel );

		io.on( 'connection', socket => {
				socket.on( 'create channel', ( data) => {
						// channelSocketCtrl.createChannel( data, io );
				} );

				socket.on( 'delete channel', ( data) => {
						// channelSocketCtrl.deleteChannel( data, io );
				} );

				socket.on( 'update channel', ( data) => {
						// channelSocketCtrl.updateChannel( data, io );
				} );

				socket.on( 'subscribe to channel', ( data ) => {
						channelSocketCtrl.subscribeToChannel( data, io, socket );
				} );

				socket.on( 'enter channel', ( data ) => {
						channelSocketCtrl.enterChannel( data, io, socket );
				} );

				socket.on( 'leave channel', ( data ) => {
						channelSocketCtrl.leaveChannel( data, io, socket );
				} );

				socket.on( 'unsubscribe from channel', ( data ) => {
						channelSocketCtrl.unsubscribeFromChannel( data, io, socket );
				} );

		} );
};
