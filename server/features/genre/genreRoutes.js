const genreCtrl = require( "./genreCtrl" );

module.exports = app => {
	app.route( "/api/genres" )
        .get( genreCtrl.getAllGenres )
        .post( genreCtrl.addGenre );

	app.route( "/api/genres/names" )
				.get( genreCtrl.getAllGenreNames );

	app.route( "/api/genres/:name" )
        .get( genreCtrl.getOneGenre );

	app.route( "/api/genres/:_id" )
        // .get( genreCtrl.getGenreById )
        .put( genreCtrl.updateGenreById )
        .delete( genreCtrl.deleteGenreById );

	app.route( "/api/genres/:genre_id/channels/:channel_id" )
        .put( genreCtrl.addChannelToGenre )
        .delete( genreCtrl.deleteChannelFromGenre );

};
