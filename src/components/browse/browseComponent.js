import browseViewHtml from "./browse-view-tmpl.html";

function browseCtrl() {
	const browse = this;

	browse.test = "This is a test for browse components!!!";

}

const browseComponent = {
	template: browseViewHtml
  , controller: browseCtrl
};

export default browseComponent;
