const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const Recording = new mongoose.Schema( {
	cloudUrl: { type: String }
	 , dateCreated: { type: Date, default: Date.now() }
	 , createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
	 , description: { type: String }
} );

Recording.plugin( findOrCreate );

module.exports = mongoose.model( "Recording", Recording );
