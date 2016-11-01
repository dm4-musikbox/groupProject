import socketTestHtml from './socket-test-view-tmpl.html';

function socketTestCtrl( $scope ) {
    const socket = io.connect();

    this.users = [];
    this.recordings = [];

    this.saveRecordings = recording => {
        if ( recording ) {
            socket.emit( 'save recording', recording )
        }
    };

    socket.on( 'new recording', data => {
        this.recordings.push( data );
        $scope.$apply();
    } )
}

const socketTestComponent = {
    template: socketTestHtml
    , controller: socketTestCtrl
}

export default socketTestComponent;
