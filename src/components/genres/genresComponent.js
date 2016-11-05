import genresViewHtml from "./genres-view-tmpl.html";

function genresCtrl() {
	const genres = this;

	genres.test = "This is a test for Genresss Components!!";

}

const genresComponent = {
	template: genresViewHtml
  , controller: genresCtrl
};

export default genresComponent;
