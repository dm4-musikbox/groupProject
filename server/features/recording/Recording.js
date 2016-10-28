const Recording = new mongoose.Schema( {
    cloudUrl: { type: String }
    , type: { enum: [ ‘public’, ‘private’ ], required: true }
    , dateCreated: { type: Date, default: Date.now() }
    , createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    , channels: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' } ]
} );

module.exports = mongoose.model( 'Recording', Recording );
