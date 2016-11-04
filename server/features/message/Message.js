const mongoose = require( "mongoose" );

const Message = new mongoose.Schema( {
		type: { type: String, enum: [ "message", "recording" ], required: true }
		, userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, userName: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, content: { type: String, trim: true }
		, timestamp: { type: Date, default: Date.now() }
		, recording: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
} );

module.exports = mongoose.model( "Message", Message );
