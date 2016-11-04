const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const User = new mongoose.Schema(
	{
		name: { type: String, required: true }
		, email: { type: String }
		, genre: [ { type: String, required: true } ]
		, userLinks: { type: String, lowercase: true, trim: true }
		, userChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
	}
);

User.plugin( findOrCreate );

module.exports = mongoose.model( "User", User );
