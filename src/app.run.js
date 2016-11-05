function run( $rootScope, $state, $timeout, authService, authManager, jwtHelper, lock ) {
	lock.interceptHash();
	$rootScope.authService = authService;
	authService.registerAuthenticationListener();
	authManager.checkAuthOnRefresh();
	authManager.redirectWhenUnauthenticated();

	$rootScope.$on( "$stateChangeStart", ( event, to, toParams ) => {
		const token = localStorage.getItem( "id_token" );
		if ( to.data && to.data.requiresLogin ) {
			if ( jwtHelper.isTokenExpired( token ) ) {
				$timeout( () => {
					$state.go( "landing-page" );
				} );
			}
		}
	} );
}

export default run;
