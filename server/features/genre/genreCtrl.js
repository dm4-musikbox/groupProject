const Genre = require( "./Genre" );

module.exports =
{
	getAllGenres( req, res ) {
		Genre.find( ( err, genres ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( genres );
		} );
	}
	, getAllGenreNames( req, res ) {
		return res.status( 200 ).json( genreNames );
	}
  , addGenre( req, res ) {
		new Genre( req.body ).save( ( err, genre ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 201 ).json( genre );
		} );
	}
  , getOneGenre( req, res ) {
		Genre.findOne( { name: req.params.name }, ( err, genre ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( genre );
		} );
	}
  , updateGenreById( req, res ) {
		Genre.findByIdAndUpdate( req.params.genre_id, req.body, { new: true }, ( err, genre ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			return res.status( 200 ).json( genre );
		} );
	}
  , deleteGenreById( req, res ) {
		Genre.findByIdAndRemove( req.params.genre_id, ( err, response ) => {
			if ( err ) {
				return res.status( 500 ).json( err );
			}
			console.log( response );
			return res.status( 200 ).json( response );
		} );
	}
  , addChannelToGenre( req, res ) {
			Genre.findByIdAndUpdate( req.params.genre_id, { $addToSet: { channels: req.params.channel_id } }, { new: true }, ( err, genre ) => {
					if ( err ) {
							return res.status( 500 ).json( err );
					}
					return res.status( 200 ).json( genre );
			} );
	}
	, deleteChannelFromGenre( req, res ) {
			Genre.findByIdAndUpdate( req.params.genre_id, { $pull: { channels: req.params.channel_id } }, { new: true }, ( err, genre ) => {
					if ( err ) {
							return res.status( 500 ).json( err );
					}
					return res.status( 200 ).json( genre );
			} );
	}
};

const genreNames = [
		{
				displayName: "Pop"
				, name: "pop"
		}
		, {
				displayName: "Hip Hop"
				, name: "hip-hop"
		}
		, {
				displayName: "Latino"
				, name: "latino"
		}
		, {
				displayName: "EDM/Dance"
				, name: "edm-dance"
		}
		, {
				displayName: "Country"
				, name: "country"
		}
		, {
				displayName: "Rock"
		    , name: "rock"
	  }
		, {
				displayName: "RnB"
				, name: "rnb"
			}
		, {
				displayName: "Indie"
				, name: "indie"
		}
		, {
				displayName: "Soul"
				, name: "soul"
			}
		, {
				displayName: "Folk"
				, name: "folk"
			}
		, {
				displayName: "Christian"
				, name: "christian"
			}
		, {
				displayName: "Jazz"
				, name: "jazz"
			}
		, {
				displayName: "Classical"
				, name: "classical"
			}
		, {
				displayName: "Metal"
				, name: "metal"
			}
		, {
				displayName: "K-pop"
				, name: 'k-pop'
			}
		, {
				displayName: "Reggae"
				, name: "reggae"
			}
		, {
				displayName: "Punk"
				, name: "punk"
			}
		, {
				displayName: "Blues"
				, name: "blues"
			}
		, {
				displayName: "Word"
				, name: "word"
			}
		, {
				displayName: "Comedy"
				, name: "comedy"
			}
];
