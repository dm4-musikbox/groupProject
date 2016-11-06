import browseGridHtml from './grid.html';
import './styles/sass/grid.scss';

function browseGridCtrl() {
  const grid = this;

  grid.test = "grid";
}

const browseGridComponent = {
  template: browseGridHtml
  , controller: browseGridCtrl
};

export default browseGridComponent;
