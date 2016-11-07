function userService( $http, ref, socketFactory ) {
		let currentUser,
				currentChannel;

		this.getCurrentUser = () => {
				return currentUser;
		};

		this.setCurrentChannel = ( channelId ) => {
			currentChannel = channelId;
		};

		this.findOrCreateUser = ( profile ) => {
				if ( !profile ) {
						profile = JSON.parse( localStorage.profile );
				}
				const user = {
						authId: profile.user_id
						, fullName: profile.name
						, firstName: profile.given_name
						, lastName: profile.family_name
						, email: profile.email
						, photo: profile.picture
				};
		 		return $http
									.post( `${ ref.url }/api/users`, user )
									.then( user => {
											currentUser = user.data;
									} );
		};

		socketFactory.on( "get updated user", data => {
				currentUser = data;
		} );

}

export default userService;
