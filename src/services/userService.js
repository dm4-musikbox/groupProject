function userService( $http, ref, socketFactory ) {
		let currentUser;

		this.findOrCreateUser = ( profile ) => {
				if ( !profile ) {
						if ( localStorage.profile ) {
								profile = JSON.parse( localStorage.profile );
						}
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
													return user.data;
											}
									);
		};

		this.updateCurrentUser = ( updatedUser ) => {
				if ( updatedUser ) {
						return $http.put( `${ ref.url }/api/users/${ updatedUser._id }`, updatedUser );
				}
				return $http.get( `${ ref.url }/api/users/${ currentUser._id }` );
		};

		this.setCurrentUser = ( user ) => {
				currentUser = user;
		};

		this.getCurrentUser = () => {
				return currentUser;
		};

}

export default userService;
