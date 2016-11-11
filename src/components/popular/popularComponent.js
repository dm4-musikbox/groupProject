import popularViewHtml from './popular-view-tmpl.html';

function popularCtrl () {
    // console.log( this.artistChannels );
}

const popularComponent = {
    template: popularViewHtml
    , controller: popularCtrl
    , bindings:
        {
            artistChannels: '<'
        }
};

export default popularComponent;
