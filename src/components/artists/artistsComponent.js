import artistsViewHtml from './artists-view-tmpl.html';

function artistsCtrl() {
    const artists = this;

    artists.test = "This is test for artists components!!!";

}

const artistsComponent = {
  template: artistsViewHtml
  , controller: artistsCtrl
};

export default artistsComponent;
