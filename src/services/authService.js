function authService( $rootScope, $state, lock, authManager ) {

	let userProfile = JSON.parse( localStorage.getItem( "profile" ) ) || {};

	// console.log( userProfile ); 

	function login() {
		lock.show();
	}

      // Logging out just requires removing the user's
      // id_token and profile
	function logout() {
		localStorage.removeItem( "id_token" );
		localStorage.removeItem( "profile" );
		authManager.unauthenticate();
		userProfile = {};
		$state.go( "landing-page" );
	}

      // Set up the logic for when a user authenticates
      // This method is called from app.run.js
	function registerAuthenticationListener() {
		lock.on( "authenticated", ( authResult ) => {
			localStorage.setItem( "id_token", authResult.idToken );
			authManager.authenticate();

			lock.getProfile( authResult.idToken, ( error, profile ) => {
				if ( error ) {
					console.log( error );
				}
				localStorage.setItem( "profile", JSON.stringify( profile ) );
				$rootScope.$broadcast( "userProfileSet", profile );

				// console.log( "Authenticated! token: ", authResult.idToken, "profile: ", profile );

				$state.go( "genres-view", { profile } );
			} );
		} );
	}

	return {
		userProfile
		, login
		, logout
		, registerAuthenticationListener
	};
}

export default authService;
