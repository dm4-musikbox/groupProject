const Recording = require( "./Recording" );
const User = require( "./../user/User" );
const Channel = require( "./../channel/Channel" );
const AWS = require( "aws-sdk" );
AWS.config.loadFromPath( "server/config/awsConfig.json" );

module.exports = {
	getAllRecordings( req, res ) {
		console.log( "getAllRecordings active!" );
        // get all recordings from recordings collection
		Recording.find( ( err, recordings ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( recordings );
		} );
	}
	 , uploadFileToS3( req, res ) {
		console.log( "uploadFileToChannel active!" );
					  const s3 = new AWS.S3();
					  const fileName = req.query[ "file-name" ];
					  const fileType = req.query[ "file-type" ];
					  const s3Params = {
					    Bucket: "musikbox-recordings/" + "58196bc83a5bd823fca47594"
					    , Key: fileName
					    , Expires: 60
					    , ContentType: fileType
					    , ACL: "public-read"
					  };

					  s3.getSignedUrl( "putObject", s3Params, ( err, data ) => {
					    if ( err ) {
					      console.log( err );
					      return res.end();
					    }
					    const returnData = {
					      signedRequest: data
					      , url: `https://musikbox-recordings.s3.amazonaws.com/${ fileName }`
					    };
						console.log( returnData );
					    res.write( JSON.stringify( returnData ) );
					    res.end();
					  } );
	}
	 , addRecordingToChannel( req, res ) {
				console.log( "addRecordingToChannel active!" );
	      // create recording and adds to recordings collection
	      // add recording id to channel's recordings array
				new Recording( req.body ).save( ( err, recording ) => {
					if ( err ) {
						return res.status( 500 ).json( err );
					}
					console.log( recording );
					Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $push: { channelRecordings: recording._id } }, { new: true }, ( err, channel ) => {
						if ( err ) {
							return res.status( 500 ).json( err );
						}
						return res.status( 200 ).json( channel );
					} );
				} );
			}
		 , deleteRecordingFromChannel( req, res ) {
			console.log( "deleteRecordingFromChannel active!" );
					// delete recording from recordings collection
	        // delete recording ID from channel's recordings array
			Recording.findByIdAndRemove( req.params.recording_id, ( err, response ) => {
				if ( err ) {
					return res.status( 500 ).json( err );
				}
				console.log( response );

				Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $pull: { channelRecordings: req.params.recording_id } }, { new: true }, ( err, channel ) => {
					if ( err ) {
						return res.status( 500 ).json( err );
					}
					return res.status( 200 ).json( channel );
				} );
			} );
		}
	 , deleteAllRecordingsFromChannel( req, res ) {
		console.log( "deleteAllRecordingsFromChannel active!" );
		        // delete recordings that match the passed in channel id from recordings collection
		        // find associated channel and delete all recording ids from channel's recordings array
		const channelRecordings = req.body.channelRecordings;
		for ( let i = 0; i < channelRecordings.length; i++ ) {
			Recording.findByIdAndRemove( channelRecordings[ i ], ( err, response ) => {
				if ( err ) {
					return res.status( 500 ).json( err );
				}
				console.log( "Recording removed!", response );
			} );
		}
		Channel.findOneAndUpdate( { _id: req.params.channel_id }, { $set: { channelRecordings: [] } }, { new: true }, ( err, channel ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( channel );
		} );
	}
	  , updateRecording( req, res ) {
		console.log( "updateRecording active!" );
		Recording.findOneAndUpdate( { _id: req.params.recording_id }, { $set: req.body }, { new: true }, ( err, recording ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			Channel.findOne( { _id: req.params.channel_id }, { $set: { channelRecordings: [] } }, { new: true }, ( err, channel ) => {
				if ( err ) {
					return res.status( 500 ).json( err );
				}
				return res.status( 200 ).json( channel );
			} );
		} );
	}
};
