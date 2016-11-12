const mongoose = require( "mongoose" );
const findOrCreate = require( "mongoose-findorcreate" );

const Channel = new mongoose.Schema(
	{
		type: { type: String, enum: [ "public", "private" ], default: "private", required: true }
		, name: { type: String, required: true }
		, description: { type: String, required: true }
		, photoUrl: { type: String }
		, genres: [ { type: String, required: true } ]
		, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
		, admins: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, channelRecordings: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
		, channelMessages: [ { type: mongoose.Schema.Types.ObjectId, ref: "Message" } ]
		, invitedAsAdmin: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
		, invitedAsMember: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
	}
);

function autoPopulate( next ) {
	this
				.populate( "createdBy members admins" )
				.populate(
		{
			path: "channelRecordings"
							, model: "Recording"
							, populate:
							{
								path: "createdBy"
													, model: "User"
							}
		} )
				.populate( {
					path: "channelMessages"
						, model: "Message"
						, populate: [
							{
								path: "author"
										, model: "User"
							}
							, {
								path: "recording"
									, model: "Recording"
							}
						]
				} );
	next();
}

Channel.plugin( findOrCreate );

Channel
		.pre( "findOne", autoPopulate )
		.pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "Channel", Channel );
