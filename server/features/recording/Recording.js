const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const Recording = new mongoose.Schema( {
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, userName: { type: String }
		, dateCreated: { type: Date, default: Date.now() }
		, description: { type: String }
		, s3ETag: { type: String }
		, s3Location: { type: String }
		, s3Bucket: { type: String }
		, s3Key: { type: String }
} );

Recording.plugin( findOrCreate );

module.exports = mongoose.model( "Recording", Recording );
