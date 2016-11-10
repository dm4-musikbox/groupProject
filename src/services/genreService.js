function genreService( $http, ref ) {
	this.getGenreNames = () => {
		return $http.get( `${ ref.url }/api/genres/names` );
	};


	this.getChannelsByGenreName = ( genreName ) => {
		localStorage.setItem( 'currentGenreName', JSON.stringify( genreName ) );
		return $http.get( `${ ref.url }/api/genres/${ genreName }`);
	};
}

export default genreService;
