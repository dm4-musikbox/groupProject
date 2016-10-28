const mongoose = require( "mongoose" );

const Channel = new mongoose.Schema(
	{
		type: { type: String, enum: [ "public", "private" ], required: true }
    , admins: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
    , genres: [ { type: String, required: true } ]
    , members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
    , channelRecordings: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
    , channelMessages: [ { type: mongoose.Schema.Types.ObjectId, ref: "Message" } ]
	}
);

module.exports = mongoose.model( "Channel", Channel );
