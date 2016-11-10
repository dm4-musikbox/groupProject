function artistService ( $http, ref ) {
    this.getAllArtistChannels = () => {
        return $http.get( `${ ref.url }/api/channels` );
    };
}

export default artistService;
