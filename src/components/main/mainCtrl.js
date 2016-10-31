import authService from './../../services/authService';
import mainViewHtml from './main-view-tmpl.html';

function mainCtrl( authService ) {

  const main = this;

  main.authService = authService;

}

const mainComponent = {
  template: mainViewHtml
  , controller: mainCtrl
}

export default mainComponent;
