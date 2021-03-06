import authService from "./../../services/authService";
import landingPageViewHtml from "./landing-page-view-tmpl.html";
import "./landing-page-view.scss";

function landingPageCtrl( authService ) {

	const landingPage = this;

	landingPage.authService = authService;

}

const landingPageComponent = {
	template: landingPageViewHtml
  , controller: landingPageCtrl
};

export default landingPageComponent;
