const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate");

const Channel = new mongoose.Schema(
	{
		type: { type: String, enum: [ "public", "private" ], required: true }
		, name: { type: String, required: true }
    , admins: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
    , genres: [ { type: String, required: true } ]
    , members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
    , channelRecordings: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
    , channelMessages: [ { type: mongoose.Schema.Types.ObjectId, ref: "Message" } ]
	}
);

Channel.plugin(findOrCreate);

module.exports = mongoose.model( "Channel", Channel );
