import authService from './../../services/authService';

function landingPageCtrl( authService ) {

    const landingPage = this;

    landingPage.authService = authService;

}

export default landingPageCtrl;
