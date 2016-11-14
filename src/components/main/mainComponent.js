import mainViewHtml from "./main-view-tmpl.html";
import "./styles/sass/main.scss";

function mainCtrl( $rootScope, authService, socketFactory, userService  ) {
	this.$onInit = () => {
		this.authService = authService;
		this.isAuthenticated = $rootScope.isAuthenticated;
		let data = {};
		data.user = this.user;
		socketFactory.emit( 'enter app', data );
	};

	this.$onChanges = ( changes ) => {
			console.log( changes );
	}

	this.updateCurrentUser = ( updatedUser ) => {
		userService
						.updateCurrentUser( updatedUser )
						.then( user => {
							this.user = user.data;
							userService.setCurrentUser( this.user );
						}
						);
	};

	socketFactory.on( "get user", data => {
		this.user = data;
		userService.setCurrentUser( this.user );
		console.log( 'updated user received: ', this.user );
	} );

	socketFactory.on( 'app entered', () => {
		console.log( 'app entered' );
	} );
}

const mainComponent = {
	template: mainViewHtml
	  , controller: mainCtrl
		, bindings:
		{
			genreNames: '<'
			, user: '<'
		}
};

export default mainComponent;
