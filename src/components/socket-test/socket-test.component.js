import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( $scope ) {
    const socket = io.connect();

    this.users = [];
    this.messages = [];

    this.sendMessage = message => {
        if ( message ) {
            socket.emit( 'send message', message )
        }
    };

    socket.on( 'get message', data => {
        this.messages.push( data );
        $scope.$apply();
    } )
}

const socketTestComponent = {
    template: socketTestHtml
    , controller: socketTestCtrl
}

export default socketTestComponent;
