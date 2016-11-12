const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const User = new mongoose.Schema(
	{
		authId: { type: String, unique: true, required: true }
		, fullName: { type: String, required: true }
		, firstName: { type: String }
		, lastName: { type: String }
		, userName: { type: String }
		, email: { type: String }
		, genre: [ { type: String } ]
		, photo: { type: String }
		, notifications: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, createdChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, adminInChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, memberInChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, invitedAsMember: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, invitedAsAdmin: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
		, userLinks: [ { type: String, lowercase: true, trim: true } ]
	}
);

function autoPopulate( next ) {
	this.populate( "createdChannels adminInChannels memberInChannels invitedAsMember invitedAsAdmin" );
	next();
}

User.plugin( findOrCreate );
User
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "User", User );
