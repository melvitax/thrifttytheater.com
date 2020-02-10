var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './js/_webpack_entry.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: '_webpack.js'
    }, 
    plugins: [
        new CopyPlugin([
            //JQuery
            { from: './node_modules/jquery/dist/jquery.min.js', to: './vendor/jquery' },
            // Bootstrap
            { from: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', to: './vendor/bootstrap' },
            { from: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map', to: './vendor/bootstrap' },
            { from: './node_modules/bootstrap/scss/', to: './vendor/bootstrap/_scss' },
            // Video.js
            { from: './node_modules/video.js/dist/video.min.js', to: './vendor/video.js/' },
            { from: './node_modules/video.js/src/css', to: './vendor/video.js/_scss' },
            // YouTube-Video.js
            { from: './node_modules/youtube-video-js/dist/youtube-video.min.js', to: './vendor/video.js/' },
            // Font Awesome
            { from: './node_modules/font-awesome/fonts', to: './vendor/font-awesome/fonts' },
            { from: './node_modules/font-awesome/scss', to: './vendor/font-awesome/_scss' },
            // Moment.js
            { from: './node_modules/moment/min/moment.min.js', to: './vendor/moment/' },
            // intersection-observer.js
            { 
              from: './node_modules/intersection-observer/intersection-observer.js', to: './vendor/intersection-observer/'
            }
        ]),
    ],
};