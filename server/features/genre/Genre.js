const mongoose = require( 'mongoose' );

const Genre = new mongoose.Schema( {
    name: { type: String }
    , description: { type: String }
    , channels: [ { type: mongoose.Schema.Types.ObjectId, ref: "Channel" } ]
} );

module.exports = mongoose.model( 'Genre', Genre );
