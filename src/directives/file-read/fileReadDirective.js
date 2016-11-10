function fileReadDirective( uploadService ) {
	return {
		restrict: "A"
  , scope: {
	userId: "@"
      , channelId: "@"
}
	, link( scope, elem, attrs ) {
      // when element value changes, callback is invoked
  		elem.bind( "change", ( changeEvent ) => {
  			const files = elem[ 0 ].files;
  			const file = files[ 0 ];
  			console.log( file );
  			if ( file == null ) {
  				return alert( "No file selected." );
  			}

        // uploadService.setCurrentUserAndChannelId( scope.userId, scope.channelId );
			uploadService.setCurrentUserAndChannelId( "58196bc83a5bd823fca47594", "5818046d2643fcff7ad9aea1" );
  			uploadService.getSignedRequest( file );
  		} );
	}
	};
}

export default fileReadDirective;
