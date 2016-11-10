const mongoose = require( "mongoose" );

const Genre = new mongoose.Schema( {
	name: { type: String }
		, displayName: { type: String }
    , description: { type: String }
    , channels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
} );

function autoPopulate( next ) {
	this.populate( "channels" );
	next();
}

Genre
    .pre( "findOne", autoPopulate )
    .pre( "findOneAndUpdate", autoPopulate );

module.exports = mongoose.model( "Genre", Genre );
