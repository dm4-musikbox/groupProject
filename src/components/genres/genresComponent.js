import genresViewHtml from './genres-view-tmpl.html';
import './styles/sass/genresGrid.scss';

function genresCtrl() {
	const genres = this;

	genres.test = "This is a test for Genresss Components!!";
}

const genresComponent = {
	template: genresViewHtml
  , controller: genresCtrl
};

export default genresComponent;
