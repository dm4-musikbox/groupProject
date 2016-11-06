import navbarHtml from './navbar.html';
import './styles/sass/navbar.scss';

function navbarCtrl() {
	const navbar = this;

	navbar.test = "browse navbar";

}

const navbarComponent = {
  template: navbarHtml
  , controller: navbarCtrl
};

export default navbarComponent;
