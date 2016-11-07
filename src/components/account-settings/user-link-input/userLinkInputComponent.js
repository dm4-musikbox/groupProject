import userLinkInputHtml from './user-link-input-tmpl.html';

function userLinkInputCtrl() {

}

const userLinkInputComponent = {
    controller: userLinkInputCtrl
    , template: userLinkInputHtml
    , bindings: {
        link: '<'
    }
};
