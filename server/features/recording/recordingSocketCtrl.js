const fs = require( 'fs' );
const path = require( 'path' );
const lame = require( 'lame' );
const Stream = require( 'stream' );
const AWS = require( 'aws-sdk' );
AWS.config.loadFromPath( 'server/config/awsConfig.json' );

const Recording = require( "./Recording" );
const User = require( "./../user/User" );
const Channel = require( "./../channel/Channel" );

module.exports = {
    createRecording ( client, stream, meta ) {
        console.log( 'saveRecording firing!', meta );
        mp3FileName = meta.user_id + '-preview.mp3';
        mp3FilePath = '/server/user-audio-previews/' + mp3FileName;

        let streamClone = require( 'stream' );

        let stream1 = stream.pipe( new streamClone.PassThrough() );

        stream1.pipe( new lame.Encoder( {
            channels: 1
            , bitDepth: 16
            , float: false

            , bitRate: 192
            , outSampleRate: 44100
            , mode: lame.STEREO
          } ) )
        .pipe( fs.createWriteStream( path.resolve( 'server/user-audio-previews', mp3FileName ) ) )
        .on( 'close', () => {
            console.log( 'Done encoding to mp3' );
            client.send( { filename: mp3FileName, url: 'http://localhost:5000/' + mp3FileName }, { type: 'mp3PreviewUrl' } );
          } );
    }
    , uploadRecordingToS3 ( client, stream, meta ) {
        console.log( 'uploading to S3' );
        let s3obj = new AWS.S3();

        let body = fs.createReadStream( mp3FilePath );

        const params = {
            Bucket: 'musikbox-recordings/' + meta.user_id
            , Key: meta.user_id + '_' + new Date().toISOString() + '.mp3'
            , Body: body
            , ACL: 'public-read'
        };

        s3obj.upload( params )
            .on( 'httpUploadProgress', evt => { console.log( evt ); } )
            .send( ( err, data ) => {
                console.log( err, data );
                client.send( data, { type: 's3Data' } );
                fs.unlink( mp3FilePath );
                client.close();
              } );
    }
    , saveRecording( data, io ) {
        const recording = data.recording;
        const channel_id = data.channel_id;

        new Recording( data.recording ).save( ( err, recording ) => {
            if ( err ) {
                throw err;
            }
            io.sockets.emit( 'get recording', recording );
            Channel.findByIdAndUpdate( channel_id, { $push: { channelRecordings: recording._id } }, { new: true } )
                .populate( 'channelMessages channelRecordings' )
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
        const channel_id = data.channel_id;

        Recording.findByIdAndRemove( data.recording_id, ( err, response ) => {
          if ( err ) {
             throw err;
          }
          console.log( response );
          Channel.findByIdAndUpdate( channel_id, { $pull: { channelRecordings: data.recording_id } }, { new: true } )
              .populate( 'channelMessages channelRecordings' )
              .exec( ( err, channel ) => {
                  if ( err ) {
                    throw err;
                  }
                  getUpdatedChannel( channel, io );
              } );
        } );
    }

    , updateRecording( data, io ) {
        Recording.findByIdAndUpdate( data.recording._id, { $set: { description: data.recording.description } }, { new: true }, ( err, recording ) => {
          if ( err ) {
              throw err;
          }
          Channel.findById( data.channel_id )
              .populate( 'channelMessages channelRecordings' )
              .exec( ( err, channel ) => {
                if ( err ) {
                  throw err;
                }
                getUpdatedChannel( channel, io );
              } );
        } );
    }
}

function updateChannel( channel_id, io, update ) {
    console.log( update );
    Channel.findByIdAndUpdate( channel_id, update, { new: true } )
        .populate( 'channelMessages channelRecordings' )
        .exec( ( err, channel ) => {
            if ( err ) {
              throw err;
            }
            getUpdatedChannel( channel, io );
        } );
}

function getUpdatedChannel( channel, io ) {
    return io.sockets.emit( 'get channel', channel );
}
