const fs = require( "fs" );
const path = require( "path" );
const lame = require( "lame" );
const Stream = require( "stream" );
const AWS = require( "aws-sdk" );
AWS.config.loadFromPath( "server/config/awsConfig.json" );

const Recording = require( "./Recording" );
const User = require( "./../user/User" );
const Channel = require( "./../channel/Channel" );

module.exports = {
	createRecording( io, socket, client, stream, meta ) {
		console.log( "createRecording firing! meta is ", meta );

		channelId = meta.channelId;
		mp3FileName = `${ meta.userId  }-preview.mp3`;
		mp3FilePath = `/server/user-audio-previews/${  mp3FileName }`;

		const streamClone = require( "stream" );
		const stream1 = stream.pipe( new streamClone.PassThrough() );

		stream1
        .pipe( new lame.Encoder( {
    	        channels: 1
              , bitDepth: 16
              , float: false

              , bitRate: 192
              , outSampleRate: 44100
              , mode: lame.STEREO
} ) )
        .pipe( fs.createWriteStream( path.resolve( "server/user-audio-previews", mp3FileName ) ) )
        .on( "close", () => {
          	const data = {
          		filename: mp3FileName
                          , url: `http://localhost:5000/${  mp3FileName }`
                          , type: "mp3PreviewUrl"
          	};
          	console.log( data );
          	socket.emit( "get recording preview", data );
} );
	}
  , uploadRecordingToS3( data, io, socket ) {
    	console.log( "uploadRecordingToS3 firing!" );

    	const s3obj = new AWS.S3();
    	const mp3FileName = `${ data.userId  }-preview.mp3`;
    	const mp3FilePath =  `${ __dirname  }/../../user-audio-previews/${  mp3FileName }`;
    	const body = fs.createReadStream( mp3FilePath );
    	const params = {
		Bucket: `musikbox-recordings/${  data.userId }`
          , Key: `${ data.userId  }_${  new Date().toISOString()  }.mp3`
          , Body: body
          , ACL: "public-read"
    	};

    	s3obj
          .upload( params )
          .on( "httpUploadProgress", evt => {
          	 console.log( evt );
} )
          .send( ( err, s3Info ) => {
    	        socket.emit( "get S3 data", s3Info );
              // fs.unlink( mp3FilePath );
} );
}
  , saveRecording( data, io, socket ) {
  	console.log( "saveRecording firing!" );

  	const recordingToSave = data.recording;
  	const channelId = data.channelId;

  	new Recording( recordingToSave ).save( ( err, recording ) => {
  		if ( err ) {
  			   throw err;
  		}
  		Channel
          .findOneAndUpdate( { _id: channelId }, { $push: { channelRecordings: recording._id } }, { new: true } )
          .exec( ( err, channel ) => {
            	if ( err ) {
            		  throw err;
            	}
	getUpdatedChannel( channel, io );
} );
  	} );
}
  , updateRecording( data, io ) {
  	console.log( "updateRecording firing!" );

  	const recording = data.recording;
  	const channelId = data.channelId;

  	Recording.findOneAndUpdate( { _id: recording._id }, { $set: { description: recording.description } }, { new: true }, ( err, recording ) => {
  		if ( err ) {
  			   throw err;
  		}
  		Channel
          .findOne( { _id: channelId } )
          .exec( ( err, channel ) => {
          	if ( err ) {
          		throw err;
          	}
          	getUpdatedChannel( channel, io );
} );
	} );
}

  , deleteRecording( data, io ) {
  	const recording = data.recording;
  	const channelId = data.channelId;

  	Recording.findByIdAndRemove( recording._id, ( err, response ) => {
  		if ( err ) {
  			throw err;
  		}

  		deleteFromS3( recording );

  		Channel
          .findOneAndUpdate( { _id: channelId }, { $pull: { channelRecordings: recording._id } }, { new: true } )
          .exec( ( err, channel ) => {
            	if ( err ) {
            		throw err;
            	}
	getUpdatedChannel( channel, io );
} );
	} );
}

};

function deleteFromS3( recording ) {
	console.log( "deleteFromS3 firing" );
	const s3obj = new AWS.S3();

	const params = {
		Bucket: recording.s3Bucket
        , Key: recording.s3Key
	};

	s3obj.deleteObject( params, ( err, data ) => {
		if ( err ) {
			console.log( "s3 delete encountered an error: ", err, err.stack );
		}		else {
			console.log( "s3 delete worked: ", data );
		}
	} );
}

function getUpdatedChannel( channel, io ) {
	io.to( channel._id ).emit( "get channel", channel );
}
