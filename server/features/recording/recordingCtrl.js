const Recording = require( "./Recording" );
const User = require( "./../User/User" );
const Channel = require( "./../Channel/Channel" );

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
    , addNewRecordingToChannel( req, res ) {
	console.log( "createRecording active!" );
        // create recording and adds to recordings collection
        // add recording id to channel's recordings array
	new Recording( req.body ).save( ( err, recording ) => {
		if ( err ) {
			return res.status( 500 ).json( err );
		}
		Channel.findByIdAndUpdate( recording.channels[ 0 ], { $push: { recordings: recording._id } }, { new: true }, ( err, channel ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( channel );
		} );
	} );
}
    // , getRecordingById ( req, res ) {
    //     console.log( 'getRecordingById active!' );
    //     // get one recording by its ID
    //     Recording.findById( req.params.recording_id, ( err, recording ) => {
    //         if ( err ) {
    //             return res.status( 500 ).json( err );
    //         }
    //         return res.status( 200 ).json( recording );
    //     } );
    // }
    , deleteRecordingFromChannel( req, res ) {
	console.log( "deleteRecordingFromChannel active!" );
        // delete recording ID from channel's recordings array
        // if recording's channels array is longer than 1, do not delete from recordings collection.
        // if recording's channels array's length is 1, delete from recordings collection as well.

	Channel.findByIdAndUpdate( req.params.recording_id, { new: true }, ( err, channel ) => {
		if ( err ) {
			return res.status( 500 ).json( err );
		}
		for ( let i = 0; i < channel.recordings.length; i++ ) {
			if ( channel.recordings[ i ].toString() === req.params.recording_id ) {
				channel.recordings.splice( i, 1 );

				Recording.findById( req.params.recording_id, ( err, recording ) => {
					if ( err ) {
						return res.status( 500 ).json( err );
					}

					const recordingToSave = recording;
					if ( recordingToSave.channels.length === 1 ) {
						Recording.findByIdAndRemove( recordingToSave._id, ( err, response ) => {
							if ( err ) {
								return res.status( 500 ).json( err );
							}
							console.log( "Removed recording ", response );
						} );
					}					else if ( recordingToSave.channels.indexOf( channel._id ) !== -1 ) {
						recordingToSave.splice( recordingToSave.channels.indexOf( channel._id ), 1 );

						Recording.findByIdAndUpdate( recordingToSave._id, { $set: recordingToSave }, ( err, recording ) => {
							if ( err ) {
								return res.status( 500 ).json( err );
							}
							console.log( "Updated recording is ", recording );
						} );
					}
				} );
			}
		}
            // Channel.findById( channel._id, ( err, channel ) => {
            //     if ( err ) {
            //         return res.status( 500 ).json( err );
            //     }
		return res.status( 200 ).json( channel );
            // } );
	} );

}
    , getRecordingsByChannelId( req, res ) {
	console.log( "getRecordingsByChannelId active!" );
        // get all recordings whose channels field matches the channel id passed in through params
	Recording.find( { channels: req.params.channel_id }, ( err, recordings ) => {
		if ( err ) {
			return res.status( 500 ).json( err );
		}
		return res.status( 200 ).json( recordings );
	} );
}
    , deleteAllRecordingsByChannelId( req, res ) {
	console.log( "deleteAllRecordingsByChannelId active!" );
          // delete recordings that match the passed in channel id from recordings collection
          // find associated channel and delete all recording ids from channel's recordings array
	Channel.findByIdAndUpdate( req.params.channel_id, { $set: { recordings: [] } }, { new: true }, ( err, channel ) => {
		if ( err ) {
			return res.status( 500 ).json( err );
		}
              // Channel.findById( req.params.channel_id, ( err, channel ) => {
              //     if ( err ) {
              //         return res.status( 500 ).json( err );
              //     }
		return res.status( 200 ).json( channel );
              // } );
	} );
}
};
