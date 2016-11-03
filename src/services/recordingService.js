import { BinaryClient } from 'binaryjs-client';

function recordingService( $state, $window, socketFactory ) {
    let isRecording = false
        , audioCtx
        , source
        , recorder;

    const client = new BinaryClient( 'ws://localhost:9000' );

    this.startRecording = () => {
        if ( !navigator.getUserMedia ) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia;
        }
        if ( navigator.getUserMedia ) {
            navigator.getUserMedia( { audio: true }, initializeRecorder, errorCallback );
        }
        else {
            alert('getUserMedia not supported in this browser.');
        }
    };

    this.stopRecording = () => {
        isRecording = false;
        $window.audioStream.end();
        audioCtx.close();

        // audioCtx = null;
        // source = null;
        // recorder = null;
    };

    this.restartRecording = () => {
        this.stopRecording();
        $state.go( $state.current.name, $state.params, { reload: true } );
    }

    function initializeRecorder ( stream ) {
        $window.audioStream = client.createStream( { user_id: 'aplan88', type: 'audio' } );
        isRecording = true;
        const bufferSize = 2048;
        audioCtx = new ( $window.AudioContext || $window.webkitAudioContext )();
        source = audioCtx.createMediaStreamSource( stream );
        recorder = audioCtx.createScriptProcessor( bufferSize, 1, 1 );
        recorder.onaudioprocess = recorderProcess;
        source.connect( recorder );
        recorder.connect( audioCtx.destination );
    }

    function errorCallback ( event ) {
        alert('Error capturing audio.');
    }

    function recorderProcess( e ) {
        if ( !isRecording ) {
            return;
        }
        let left = e.inputBuffer.getChannelData( 0 );
        console.log( 'Recording' );
        $window.audioStream.write( convertFloat32ToInt16( left ) );
    }

    function convertFloat32ToInt16( buffer ) {
         let l = buffer.length;
         let buf = new Int16Array( l );
         while ( l-- ) {
           buf[ l ] = Math.min( 1, buffer[ l ] )*0x7FFF;
         }
         return buf.buffer;
     }
}

export default recordingService;
