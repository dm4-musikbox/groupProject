function config( $httpProvider, $stateProvider, $urlRouterProvider, jwtOptionsProvider, jwtInterceptorProvider, lockProvider ) {
	lockProvider.init( {
		clientID: "dxHLsmsTwuygusXFm9bs1e2bqbF91EK3"
       , domain: "musikbox.auth0.com"
       , options:
			 		{
							autoclose: false
							, auth:
									{
											redirect: false
									}
							, languageDictionary:
									{
											emailInputPlaceholder: "something@youremail.com"
				              , title: "Musikbox"
									}
            	, theme:
									{
											primaryColor: "#4d394b"
									}
					}
	} );

	jwtOptionsProvider.config(
			{
					tokenGetter() {
						return localStorage.getItem( "id_token" );
					}
			}
	);

	$httpProvider.interceptors.push( "jwtInterceptor" );

	$urlRouterProvider.otherwise( "/" );

	$stateProvider
              .state( "landing-page",
									{
											url: "/"
										, component: 'landingPageComponent'
	                		// , component: "socketTestComponent"
									}
							)
              .state( "main-view",
									{
											url: "/main"
              			, component: "mainComponent"
										, resolve:
													{
															user: ( $stateParams, userService ) => {
																	return userService.findOrCreateUser( $stateParams.profile );
														 	}
													}
										, params:
													{
															profile: null
													}
									}
							)
              .state( "channel-view",
									{
											url: "/channel/:_id"
              			, parent: "main-view"
                		, component: "channelComponent"
										, resolve:
												{
														channel: ( $stateParams, channelService ) => {
																return channelService.getChannelById( $stateParams._id );
														}
														// , user: ( userService ) => {
														// 		return userService.getCurrentUser();
														// }
												}
										, params:
												{
														_id: null
												}
									}
							)
              .state( "account-settings-view",
									{
											url: "/account-settings"
		                , parent: "main-view"
		                , template: "<account-settings-component user='$ctrl.user' on-update='$ctrl.updateCurrentUser( updatedUser )'></account-settings-component>"
									}
							)
              .state( "genre-view",
									{
											url: "/genre"
		                , parent: "main-view"
		                , component: "genreComponent"
									}
							)
              .state( "browse-view",
									{
											url: "/browse"
		                , parent: "main-view"
		                , component: "browseComponent"
									}
							)
              .state( "genres-view",
									{
											url: "/genres"
		                , parent: "browse-view"
		                , component: "genresComponent"
									}
							)
              .state( "artists-view",
									{
											url: "/artists"
		                , parent: "browse-view"
		                , component: "artistsComponent"
									}
							);
}

export default config;
