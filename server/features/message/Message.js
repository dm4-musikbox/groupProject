const mongoose = require( "mongoose" );

  const Message = new mongoose.Schema( {
    type: { type: String, enum: [ "message", "recording" ], required: true }
    , content: { type: String, trim: true }
    , timestamp: { type: Date, default: Date.now() }
    , recording: [ { type: mongoose.Schema.Types.ObjectId, ref: "Recording" } ]
    , user: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" } ]
  })

  module.exports = mongoose.model( "Message", Message );
