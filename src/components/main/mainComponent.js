import mainViewHtml from "./main-view-tmpl.html";
import "./styles/sass/main.scss";

function mainCtrl( $rootScope, authService, socketFactory, userService  ) {
		this.$onInit = () => {
				this.authService = authService;
				this.isAuthenticated = $rootScope.isAuthenticated;
		};

		this.updateCurrentUser = ( updatedUser ) => {
				userService
						.updateCurrentUser( updatedUser )
						.then( user =>
								{
										this.user = user.data;
										userService.setCurrentUser( this.user );
								}
						);
		};
		// this.updateCurrentUser = ( updatedUser ) => {
		// 		userService
		// 				.updateCurrentUser( updatedUser )
		// 				.then( user =>
		// 						{
		// 								this.user = user.data;
		// 								userService.setCurrentUser( this.user );
		// 						}
		// 				);
		// };

		socketFactory.on( "get updated user", data => {
				this.user = data;
		} );
}

const mainComponent = {
		template: mainViewHtml
	  , controller: mainCtrl
		, bindings:
				{
						user: '<user'
				}
};

export default mainComponent;
