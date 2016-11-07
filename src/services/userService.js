function userService( $http, ref, socketFactory ) {
		let currentUser;

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
									.then( user =>
											{
													currentUser = user.data;
											}
									);
		};

		this.getCurrentUser = () => {
				return currentUser;
		};

		this.updateCurrentUser = ( updatedUser ) => {
				return $http
									.put( `${ ref.url }/api/users/${ updatedUser._id }`, updatedUser )
									.then( user =>
											{
													console.log( 'user.data is ', user.data );
										 			currentUser = user.data;
											}
									);
		};

		socketFactory.on( "get updated user", data => {
				currentUser = data;
		} );

}

export default userService;
