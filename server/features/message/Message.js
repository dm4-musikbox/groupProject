const mongoose = require( "Mongoose" );

  const Message = new mongoose.Schema( {
    content: { type: String, enum: [ 'message', 'recording' ], required: true, trim: true }
    , timestamp: { type: Date, default: Date.now }
    , recording: [ { type: mongoose.Schema.Types.ObjectId }, ref: "Recording" ]
    , user: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
  })

  module.exports = mongoose.model( "Message", Message );
