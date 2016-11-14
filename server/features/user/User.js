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
		, createdChannels: [
				{
						channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
						, isUpdated: { type: Boolean, default: true }
				}
			]
		, adminInChannels: [
				{
						channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
						, isUpdated: { type: Boolean, default: true }
				}
			]
		, memberInChannels: [
				{
						channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
						, isUpdated: { type: Boolean, default: true }
				}
			]
		, invitedAsMember: [
				{
						channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
						, isUpdated: { type: Boolean, default: true }
				}
		 ]
		, invitedAsAdmin: [
				{
						channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" }
						, isUpdated: { type: Boolean, default: true }
				}
		]
		, userLinks: [ { type: String, lowercase: true, trim: true } ]
	}
);

function autoPopulate( next ) {
	this.populate( "createdChannels.channel adminInChannels.channel memberInChannels.channel invitedAsMember.channel invitedAsAdmin.channel" );
	next();
}

User.plugin( findOrCreate );
User
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "User", User );
