import authService from "./../../services/authService";
import mainViewHtml from "./main-view-tmpl.html";
import "./styles/sass/main.scss";

function mainCtrl( $rootScope, authService ) {

	const main = this;

	main.authService = authService;
	main.isAuthenticated = $rootScope.isAuthenticated;

}

const mainComponent = {
	template: mainViewHtml
  , controller: mainCtrl
};

export default mainComponent;
