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
				, img: "https://images6.alphacoders.com/374/374706.jpg"
				, size: "cover"
				, position: "center"
		}
		, {
				displayName: "Hip Hop"
				, name: "hip-hop"
				, img: "http://www.egotripland.com/wp-content/uploads/2012/11/LIVE_entertain.jpg"
				, size: "cover"
				, position: "center"
		}
		, {
				displayName: "Latino"
				, name: "latino"
				, img: "https://s-media-cache-ak0.pinimg.com/236x/d4/31/bd/d431bd929c57547f574ee375b65f6d99.jpg"
				, size: "cover"
				, position: "center"
		}
		, {
				displayName: "EDM/Dance"
				, name: "edm-dance"
				, img: "http://edmchicago.com/wp-content/uploads/2016/03/12378081_10153631008442739_3795885493727567830_o-1366x800.jpg"
				, size: "cover"
				, position: "inherit"
		}
		, {
				displayName: "Country"
				, name: "country"
				, img: "http://images.popmatters.com/misc_art/k/kickinupdust-sadgonecountry-650.jpg"
				, size: "cover"
				, position: "center"
		}
		, {
				displayName: "Rock"
		    , name: "rock"
				, img: "https://s-media-cache-ak0.pinimg.com/736x/2a/f7/ae/2af7aeb16bcef4cdd642b05894203a03.jpg"
				, size: "cover"
				, position: "center"
	  }
		, {
				displayName: "RnB"
				, name: "rnb"
				, img: "http://s1.dmcdn.net/MBaWm/1280x720-EwA.jpg"
				, size: "cover"
				, position: "inherit"
			}
		, {
				displayName: "Indie"
				, name: "indie"
				, img: "http://www.lovethispic.com/uploaded_images/114182-Indie-Circular-Pattern.jpg"
				, size: "cover"
				, position: "center"
		}
		, {
				displayName: "Soul"
				, name: "soul"
				, img: "http://cps-static.rovicorp.com/3/JPG_500/MI0001/660/MI0001660485.jpg?partner=allrovi.com"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Folk"
				, name: "folk"
				, img: "http://img1.sunset.timeinc.net/sites/default/files/image/2006/05/folk-music-center-x.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Christian"
				, name: "christian"
				, img: "http://images.8tracks.com/cover/i/000/014/713/cross_1_-6393.jpg?rect=128,0,768,768&q=98&fm=jpg&fit=max&w=640&h=640"
				, size: "cover"
				, position: "inherit"
			}
		, {
				displayName: "Jazz"
				, name: "jazz"
				, img: "http://www.thenewblackmagazine.com/PhotoFiles/jazz.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Classical"
				, name: "classical"
				, img: "https://i.ytimg.com/vi/wVoJAvT21yU/hqdefault.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Metal"
				, name: "metal"
				, img: "http://northdallasgazette.com/wordpress/wp-content/uploads/2015/11/heavy_metal_hands_1170-770x460.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "K-pop"
				, name: 'k-pop'
				, img: "http://www.billboard.com/files/styles/article_main_image/public/media/RedVelvet_Kpop2015d_650.png"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Reggae"
				, name: "reggae"
				, img: "https://contestwatchers.com/wp-content/uploads/2015/07/Enrico-Varrasso-International-Reggae-Poster-Contest-IRPC-2014.jpg"
				, size: "cover"
				, position: "inherit"
			}
		, {
				displayName: "Punk"
				, name: "punk"
				, img: "http://galeria-soldout.com/wp-content/uploads/2015/01/gandhi.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Blues"
				, name: "blues"
				, img: "https://artdoxa-images.s3.amazonaws.com/uploads/artwork/image/72359/watermark_Blues.jpg"
				, size: "cover"
				, position: "inherit"
			}
		, {
				displayName: "Word"
				, name: "word"
				, img: "http://www.md-rrhh.com.ar/images/photos/bolsadetrabajo.jpg"
				, size: "cover"
				, position: "center"
			}
		, {
				displayName: "Comedy"
				, name: "comedy"
				, img: "https://cbschicago.files.wordpress.com/2011/09/standup-comedy-thinkstock.jpg"
				, size: "cover"
				, position: "inherit"
			}
];
