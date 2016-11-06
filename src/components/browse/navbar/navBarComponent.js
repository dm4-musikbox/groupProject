import navbarHtml from './navbar.html';
import './styles/sass/navbar.scss';

function browseNavbarCtrl() {
    const navbar = this;

    navbar.test = "browse navbar";

}

const navbarComponent = {
  template: browseNavbarHtml
  , controller: browseNavbarCtrl
};

export default navbarComponent;
