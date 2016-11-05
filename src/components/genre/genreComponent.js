import genreViewHtml from "./genre-view-tmpl.html";

function genreCtrl() {
	const genre = this;

	genre.test = "This is a test for genre pop Components!!";

}

const genreComponent = {
	template: genreViewHtml
  , controller: genreCtrl
};

export default genreComponent;
