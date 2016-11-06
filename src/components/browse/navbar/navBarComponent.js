import navBarHtml from './navBar.html';
import './styles/sass/navBar.scss';

function navBarCtrl() {
	const navBar = this;

	navBar.test = "browse navbar";

}

const navBarComponent = {
  template: navBarHtml
  , controller: navBarCtrl
};

export default navBarComponent;
