function userService( $http, ref ) {
	this.setCurrentUserAndChannel = ( userId, userName, channelId ) => {
		currentUserId = userId;
		currentUserName = userName;
		currentChannel = channelId;
	};

	// this.addUser = () => {
	// 	$http.post( 'http://localhost:5000/api/users' ).then(  user => {
	// 		console.log( 'New User' + user )
	// 		// return response;
	// 	})
	// }

	this.findOrCreateUser = ( profile ) => {
		$http.post( `${ref}`)
	}
}

export default userService;
