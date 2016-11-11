const channelSocketCtrl = require( "./../channel/channelSocketCtrl" );
const messageSocketCtrl = require( "./../message/messageSocketCtrl" );
const recordingSocketCtrl = require( "./../recording/recordingSocketCtrl" );

module.exports = ( binaryServer, io ) => {
	io.on( "connection", socket => {

        /**************** CHANNEL ****************/

		// socket.on( "create channel", ( data ) => {
    //         // channelSocketCtrl.createChannel( data, io );
		// } );
		//
		// socket.on( "delete channel", ( data ) => {
    //         // channelSocketCtrl.deleteChannel( data, io );
		// } );
		//
		// socket.on( "update channel", ( data ) => {
    //         // channelSocketCtrl.updateChannel( data, io );
		// } );
		//
		// socket.on( "subscribe to channel", ( data ) => {
		// 	channelSocketCtrl.subscribeToChannel( data, io, socket );
		// } );
		//
		// socket.on( "enter channel", ( data ) => {
		// 	channelSocketCtrl.enterChannel( data, io, socket );
		// } );
		//
		// socket.on( "leave channel", ( data ) => {
		// 	channelSocketCtrl.leaveChannel( data, io, socket );
		// } );
		//
		// socket.on( "unsubscribe from channel", ( data ) => {
		// 	channelSocketCtrl.unsubscribeFromChannel( data, io, socket );
		// } );

        /**************** MESSAGE ****************/

		socket.on( "send and save message", data => {
			messageSocketCtrl.sendAndSaveMessage( data, io );
		} );

		socket.on( "update message", data => {
			messageSocketCtrl.updateMessage( data, io );
		} );

		socket.on( "delete message", data => {
			messageSocketCtrl.deleteMessage( data, io );
		} );

        /**************** RECORDING ****************/

		binaryServer.on( "connection", client => {
			client.once( "stream", ( stream, meta ) => {
				recordingSocketCtrl.createRecording( io, socket, client, stream, meta );
			} );
		} );

		socket.on( "upload recording to S3", data => {
			recordingSocketCtrl.uploadRecordingToS3( data, io, socket );
		} );

		socket.on( "save recording", data => {
			recordingSocketCtrl.saveRecording( data, io );
		} );

		socket.on( "update recording", data => {
			recordingSocketCtrl.updateRecording( data, io );
		} );

		socket.on( "delete recording", data => {
			recordingSocketCtrl.deleteRecording( data, io );
		} );

	} );
};
