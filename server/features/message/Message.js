const mongoose = require( "mongoose" );

const Message = new mongoose.Schema( {
	type: { type: String, enum: [ "message", "recording" ], required: true }
		, author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, content: { type: String, trim: true }
		, timestamp: { type: Date, default: Date.now() }
		, recording: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
} );

function autoPopulate( next ) {
	this.populate( "author recording" );
	next();
}

Message
		.pre( "find", autoPopulate )
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "Message", Message );
