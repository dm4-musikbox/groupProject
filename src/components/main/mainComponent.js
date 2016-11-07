import mainViewHtml from "./main-view-tmpl.html";
import "./styles/sass/main.scss";

function mainCtrl( $rootScope, authService, userService  ) {
		this.$onInit = () => {
				this.authService = authService;
				this.isAuthenticated = $rootScope.isAuthenticated;
				this.user = userService.getCurrentUser();
		};



}

const mainComponent = {
	template: mainViewHtml
  , controller: mainCtrl
};

export default mainComponent;
