const channelCtrl = require( "./channelCtrl.js" );
const channelSocketCtrl = require( "./channelSocketCtrl.js" );

module.exports = ( app, io ) => {
		app.get( "/api/channels", channelCtrl.getChannels );
		app.get( "/api/channels/:id", channelCtrl.getChannelById );
		app.put( "/api/channels", channelCtrl.findOrCreateChannel );
		app.put( "/api/channels/:id", channelCtrl.updateChannel );
		app.delete( "/api/channels/:id", channelCtrl.deleteChannel );

		io.on( 'connection', socket => {
				socket.on( 'create channel', ( data, io ) => {
						// channelSocketCtrl.createChannel( data, io );
				} );

				socket.on( 'delete channel', ( data, io ) => {
						// channelSocketCtrl.deleteChannel( data, io );
				} );

				socket.on( 'update channel', ( data, io ) => {
						// channelSocketCtrl.updateChannel( data, io );
				} );

				socket.on( 'subscribe to channel', ( data, io, socket ) => {
						channelSocketCtrl.subscribeToChannel( data, io, socket );
				} );

				socket.on( 'enter channel', ( data, io, socket ) => {
						channelSocketCtrl.enterChannel( data, io, socket );
				} );

				socket.on( 'leave channel', ( data, io, socket ) => {
						channelSocketCtrl.leaveChannel( data, io, socket );
				} );

				socket.on( 'unsubscribe from channel', ( data, io, socket ) => {
						channelSocketCtrl.unsubscribeFromChannel( data, io, socket );
				} );

		} );
};
