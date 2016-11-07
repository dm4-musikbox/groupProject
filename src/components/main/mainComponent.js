// import authService from "./../../services/authService";
// import userService from "./../../services/userService";
import mainViewHtml from "./main-view-tmpl.html";
import "./styles/sass/main.scss";

function mainCtrl( $rootScope, authService, userService  ) {



	const main = this;

	main.authService = authService;
	main.isAuthenticated = $rootScope.isAuthenticated;

}

const mainComponent = {
	template: mainViewHtml
  , controller: mainCtrl
};

export default mainComponent;
