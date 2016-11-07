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
		, userLinks: { type: String, lowercase: true, trim: true }
		, photo: { type: String }
		, userChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
	}
);

function autoPopulate( next ) {
	this.populate( "userChannels" );
	next();
}

User.plugin( findOrCreate );
User
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "User", User );
