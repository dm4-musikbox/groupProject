import navbarHtml from './navbar.html';
import './styles/sass/navbar.scss';

function browseNavbarCtrl() {
    const navbar = this;

    navbar.test = "browse navbar";

}

const navBarComponent = {
  template: navbarHtml
  , controller: browseNavbarCtrl
};

export default navBarComponent;
