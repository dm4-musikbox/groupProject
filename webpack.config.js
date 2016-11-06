const webpack = require( 'webpack' );

module.exports = {
    entry: "./src/app.js"
    , module: {
        loaders: [
            {
                test: /\.js/
                , exclude: /node_modules/
                , loader: "babel"
            }
            , {
                test: /\.css/
                , exclude: /node_modules/
                , loader: "style!css"
            }
            , {
                test: /\.scss$/
                , loader: 'style!css!sass'
            }
            , {
                test: /\html$/
                , loader: "html"
            }
            , {
                test: /\.mp3$/
                , loader: 'file'
            }
            // , {
            //     test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
            //     ,  loader: 'url?limit=10000&mimetype=image/svg+xml'
            // }
            , {
                test: /\.(png|jpg|svg|gif)$/
                , loader: 'file?name=assets/imgs/[name].[ext]'
            }
        ]
    }
    , plugins: [
        new webpack.ProvidePlugin(
            {
                $: "jquery"
                , jQuery: "jquery"
            }
        )
    ]
    , resolve: {
        extensions: [ "", ".js", ".css" ]
    }
    , output: {
        path: __dirname + "/dist"
        , filename: "bundle.js"
    }
};
