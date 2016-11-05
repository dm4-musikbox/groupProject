function fileReadDirective ( $http ) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
        // when element value changes, callback is invoked
        elem.bind("change", function (changeEvent) {
            const files = elem[ 0 ].files;
            const file = files[ 0 ];
            console.log( file );
            if( file == null ){
                return alert( 'No file selected.' );
            }
            getSignedRequest( file );

        /*
          Function to carry out the actual PUT request to S3 using the signed request from the app.
        */
        function uploadFile(file, signedRequest, url){
            const xhr = new XMLHttpRequest();
            xhr.open( 'PUT', signedRequest );
            xhr.onreadystatechange = () => {
                if( xhr.readyState === 4 ){
                    if( xhr.status === 200 ){
                      console.log( 'upload worked!', xhr );
                      angular
                          .element( document.querySelector( '#preview' ) )
                          .attr( 'src', url );
                    }
                    else{
                        alert('Could not upload file.');
                    }
                }
            };
            xhr.send( file );
            // $http.put( signedRequest, file )
            //     .then( response => {
            //         console.log( 'it worked!', response );
            //         if ( response.status === 200 ) {
            //             console.log( 'upload worked!' );
          //                angular
          //                    .element( document.querySelector( '#preview' ) )
          //                    .attr( 'src', url );
            //         }
            //         else {
            //             alert( 'Could not upload file.' );
            //         }
            //     } );
        }

        /*
          Function to get the temporary signed request from the app.
          If request successful, continue to upload the file using this signed
          request.
        */
        function getSignedRequest(file){
            $http.get( `/api/recordings/sign-s3?file-name=${file.name}&file-type=${file.type}` )
                .then( response => {
                    if ( response.status === 200 ) {
                        console.log( 'getting data back!', response.data );
                        uploadFile( file, response.data.signedRequest, response.data.url );
                    }
                    else {
                        alert( 'Could not get signed URL.' );
                    }
                } );
        }
      } );
    }
  }
}

export default fileReadDirective;
