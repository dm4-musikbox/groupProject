function socketFactory( $rootScope ) {
	const socket = io.connect();
	return {
		on( eventName, callback ) {
			socket.on( eventName, function() {
				const args = arguments;
				$rootScope.$apply( () => {
					callback.apply( socket, args );
				} );
			} );
		}
		, emit( eventName, data, callback ) {
			socket.emit( eventName, data, function() {
				const args = arguments;
				$rootScope.$apply( () => {
					if ( callback ) {
						callback.apply( socket, args );
					}
				} );
			} );
		}
		, removeAllListeners( eventName, callback ) {
			socket.removeAllListeners( eventName, function() {
				const args = arguments;
				$rootScope.$apply( () => {
					callback.apply( socket, args );
				} );
			} );
		}
	};
}

export default socketFactory;
