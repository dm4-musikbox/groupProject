const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const Recording = new mongoose.Schema( {
		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, dateCreated: { type: Date, default: Date.now() }
		, description: { type: String }
		, s3ETag: { type: String }
		, s3Location: { type: String }
		, s3Bucket: { type: String }
		, s3Key: { type: String }
} );

function autoPopulate( next ) {
		this.populate( 'createdBy' );
		next();
}

Recording.plugin( findOrCreate );
Recording
		.pre( 'find', autoPopulate )
		.pre( 'findOne', autoPopulate )
		.pre( 'findOneAndUpdate', autoPopulate );

module.exports = mongoose.model( "Recording", Recording );
