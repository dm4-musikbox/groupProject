import browseNavbarHtml from './navbar.html';
import './styles/sass/navbar.scss';

function browseNavbarCtrl() {
    const navbar = this;

    navbar.test = "browse navbar";

}

const browseNavbarComponent = {
  template: browseNavbarHtml
  , controller: browseNavbarCtrl
};

export default browseNavbarComponent;
