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
													return user.data;
											}
									);
		};

		this.updateCurrentUser = ( updatedUser ) => {
				return $http
									.put( `${ ref.url }/api/users/${ updatedUser._id }`, updatedUser )
		};

		this.setCurrentUser = ( user ) => {
			currentUser = user;
		}

		this.getCurrentUser = () =>{
			currentUser;
		}

}

export default userService;
