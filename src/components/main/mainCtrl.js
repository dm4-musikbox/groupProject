import authService from './../../services/authService';

function mainCtrl( authService ) {

    const main = this;

    main.authService = authService;

}

export default mainCtrl;
