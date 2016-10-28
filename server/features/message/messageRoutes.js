const messageCtrl = require( "./messageCtrl" );


module.export = app => {

app.get( '/api/messages', messageCtrl.getMessages );
app.delete( '/api/messages/:id', messageCtrl.deleteMessage );
app.put( '/api/messages/:id', messageCtrl.updateMessage );
app.post( '/api/messages', messageCtrl.postMessage );

}
