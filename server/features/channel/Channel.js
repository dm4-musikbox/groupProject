const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );
const User = require( "./../user/User.js" );
const Message = require( "./../message/Message.js" );
const Genre = require( "./../genre/Genre.js" );

const Channel = new mongoose.Schema(
	{
		type: { type: String, enum: [ "public", "private" ], default: "private", required: true }
		, name: { type: String, required: true }
		, description: { type: String, required: true }
		, photoUrl: { type: String }
		, genres: [ { type: String, required: true } ]
		, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, admins: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, channelRecordings: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
		, channelMessages: [ { type: mongoose.Schema.Types.ObjectId, ref: "Message" } ]
		, invitedAsAdmin: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, invitedAsMember: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
	}
);

function autoPopulate( next ) {
	this
				.populate( "createdBy members admins" )
				.populate(
		{
			path: "channelRecordings"
							, model: "Recording"
							, populate:
							{
								path: "createdBy"
													, model: "User"
							}
		} )
				.populate( {
					path: "channelMessages"
						, model: "Message"
						, populate: [
							{
								path: "author"
										, model: "User"
							}
							, {
								path: "recording"
									, model: "Recording"
							}
						]
				} );
	next();
}

function updateDependentDocuments( next ) {
	this.genres.forEach( genre => {
			Genre.findOneAndUpdate( { displayName: genre }, { $pull: { channels: channelId } } );
	} );

	this.channelMessages.forEach( message => {
			Message.findByIdAndRemove( message._id );
	} );

	this.channelRecordings.forEach( recording => {
			Recording.findByIdAndRemove( recording._id );
	} );

	this.admins.forEach( admin => {
			User.findById( admin._id, ( err, user ) => {
					if ( err ) throw err;
					for ( let i = user.adminInChannels.length - 1; i >= 0 ; i-- ) {
							if ( user.adminInChannels[ i ].channel._id.toString() === this._id.toString() ) {
									user.adminInChannels.splice( i, 1 );
							}
					}
					let userToSave = user;
					userToSave.save( ( err, user ) => {
							console.log( 'channel deleted from admin', user );
					} );
			} );
	} );

	this.members.forEach( member => {
			User.findById( member._id, ( err, user ) => {
					if ( err ) throw err;
					for ( let i = user.memberInChannels.length - 1; i >= 0; i-- ) {
							if ( user.memberInChannels[ i ].channel._id.toString() === this._id.toString() ) {
									user.memberInChannels.splice( i, 1 );
							}
					}
					let userToSave = user;
					userToSave.save( ( err, user ) => {
							console.log( 'channel deleted from member', user );
					} );
			} );
	} );

	this.invitedAsAdmin.forEach( admin => {
			console.log( admin );
			User.findById( admin, ( err, user ) => {
					if ( err ) throw err;
					console.log( user.invitedAsAdmin, channelId );
					for ( let i = user.invitedAsAdmin.length - 1; i >= 0; i-- ) {
							if ( user.invitedAsAdmin[ i ].channel._id.toString() === this._id.toString() ) {
									user.invitedAsAdmin.splice( i, 1 );
							}
					}
					let userToSave = user;
					userToSave.save( ( err, user ) => {
							console.log( 'channel deleted from invitedAsAdmin', user );
					} );
			} );
	} );
	this.invitedAsMember.forEach( member => {
			console.log( member );
			User.findById( member, ( err, user ) => {
					if ( err ) throw err;
					console.log( user.invitedAsMember, channelId );
					for ( let i = user.invitedAsMember.length - 1; i >= 0; i-- ) {
							if ( user.invitedAsMember[ i ].channel._id.toString() === this._id.toString() ) {
									user.invitedAsMember.splice( i, 1 );
							}
					}
					let userToSave = user;
					userToSave.save( ( err, user ) => {
							console.log( 'channel deleted from invitedAsMember', user );
					} );
			} );
	} );

	User.findById( this.createdBy._id, ( err, user ) => {
			if ( err ) throw err;
			console.log( 'created by', user );
			for ( let i = user.createdChannels.length - 1; i >= 0; i-- ) {
					if ( user.createdChannels[ i ].channel._id.toString() === this._id.toString() ) {
							user.createdChannels.splice( i, 1 );
					}
			}
			let userToSave = user;
			userToSave.save( ( err, user ) => {
					console.log( 'channel deleted from creator', user );
					// getUpdatedUser( user );
			} );
	} );

	next();
}

Channel.plugin( findOrCreate );

Channel
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate )
		.pre( "findOneAndRemove", autoPopulate, updateDependentDocuments )

module.exports = mongoose.model( "Channel", Channel );
