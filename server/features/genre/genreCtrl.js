const Genre = require( './Genre' );

module.exports = {
    getAllGenres ( req, res ) {
        Genre.find( ( err, genres ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( genres );
        } );
    }
    , addGenre ( req, res ) {
        new Genre( req.body ).save( ( err, genre ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 201 ).json( genre );
        } );
    }
    , getOneGenre ( req, res ) {
        Genre.findById( req.params.genre_id, ( err, genre ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( genre );
        } );
    }
    , getGenreById ( req, res ) {
        Genre.findById( req.params.genre_id, ( err, genre ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( genre );
        } );
    }
    , updateGenreById ( req, res ) {
        Genre.findByIdAndUpdate( req.params.genre_id, req.body, { new: true }, ( err, genre ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            return res.status( 200 ).json( genre );
        } );
    }
    , deleteGenreById ( req, res ) {
        Genre.findByIdAndRemove( req.params.genre_id, ( err, response ) => {
            if ( err ) {
                return res.status( 500 ).json( err );
            }
            console.log( response );
            return res.status( 200 ).json( response );
        } );
    }
    , addGenreToChannel( req, res ) {
       Channel.findByIdAndUpdate( req.params.channel_id, { $push: { genres: req.params.genre } }, { new: true }, ( err, response ) => {
         if ( err ) {
           return res.status( 400 ).send( err );
         }
         return res.status( 200 ).json( response );
       } );
   }
    , deleteGenreFromChannel( req, res ) {
       Channel.findByIdAndUpdate( req.params.channel_id, { $pull: { genres: req.params.genre } }, { new: true }, ( err, response ) => {
         if ( err ) {
           return res.status( 400 ).send( err );
         }
         return res.status( 200 ).json( response );
       } );
   }

}
