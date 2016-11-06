function uploadService( $http ) {
		let currentUserId
				, currentChannelId;

		this.setCurrentUserAndChannelId = ( userId, channelId ) => {
				if ( userId && channelId ) {
						currentUserId = userId;
						currentChannelId = channelId;
				}
		}

		this.getSignedRequest = ( file ) => {
				$http.get( `/api/recordings/sign-s3?file-name=${ file.name }&file-type=${ file.type }&user-id=${ currentUserId }` )
							.then( response => {
									if ( response.status === 200 ) {
										console.log( "getting data back!", response.data );
										uploadFile( file, response.data.signedRequest, response.data.url ); // plug in user id and channel id
									}	else {
										alert( "Could not get signed URL." );
									}
								} );
		}

		function uploadFile( file, signedRequest, url ) {
			const xhr = new XMLHttpRequest();
			xhr.open( "PUT", signedRequest );
			xhr.onreadystatechange = () => {
				if ( xhr.readyState === 4 ) {
					if ( xhr.status === 200 ) {
						let startSplice = url.lastIndexOf( '/' ) + 1;
						let key = url.substring( startSplice );
						let bucket = 'musikbox-recordings/' + currentUserId;
						let recording = {
								createdBy: currentUserId
								, s3Key: key
								, s3Bucket: bucket
								, s3Location: url
						};

						$http
								.post( 'http://localhost:5000/api/recordings/channels/' + currentChannelId, recording )
								.then( response => {
										console.log( response.data );
								} );

								angular
											.element( document.querySelector( "#preview" ) )
											.attr( "src", url );
					}	else {
							 alert( "Could not upload file." );
					}
				}
			};
			xhr.send( file );
		}

}

export default uploadService;
