function toggleClass() {
    return {
        restrict: 'A'
        , link: ( scope, elem, attrs ) => {
            angular.element( elem[ 0 ] ).bind( 'click', () => {
                console.log( elem );
                angular.element( elem[ 0 ] ).toggleClass( attrs.toggleClassDir );
                console.log( 'toggle class firing' );
            } );
        }
    }
}

export default toggleClass;
