const mongoose = require( "mongoose" );

const User = new mongoose.Schema(
	{
		name: { type: String, required: true }
    , genre: [ { type: String, required: true } ]
    , userLinks: { type: String, lowercase: true, trim: true }
    , userChannels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
	}
);

module.exports = mongoose.model( "User", User );
