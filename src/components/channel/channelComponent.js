import channelViewHtml from './channel-view-tmpl.html';
import './styles/channel.scss'

function channelCtrl() {
    const channel = this;

    channel.test = "This is a test for channel Components!!!";

}

const channelComponent = {
  template: channelViewHtml
  , controller: channelCtrl
};

export default channelComponent;
