var gulp = require('gulp');
var path = require('path');
var bower = require('gulp-bower');
var less = require('gulp-less');
var del = require('del');
var util = require('gulp-util');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var spritesmith = require('gulp.spritesmith');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');

var eslint = require('gulp-eslint');
var stylelint = require('gulp-stylelint');

var webpack = require('webpack');
var BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');

var argv = require('minimist')(process.argv.slice(2), {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'development'}
});

var conf = {
    less: 'src/less/*.less',
    images: ['src/images/**/*.{png,svg}', '!src/images/icons/**'],
    icons: 'src/images/icons/*.png',
    html: 'src/*.html',
    js: 'src/js/**/*.js',
    sprite: {
        imgName: 'images/build/sprite.png',
        cssName: 'less/build/sprite.less',
        imgPath: '../../images/build/sprite.png'
    },
    build: {
        tmpFolders: '**/build',
        folder: 'build',
        css: 'build/css',
        images: 'build/images',
        js: 'build/js',
        html: 'build/html'
    }
};

var webpackConfig = {
    entry: './src/js/script.js',
    output: {
        filename: 'cdp.js',
        path: path.resolve('./build/js'),
        sourceMapFilename: '[name].map'
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    plugins: [
        new ExtractTextPlugin('../css/cdp.css', { allChunks: true }),
        new BowerWebpackPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: 'node_modules',
                query: {
                    presets: [ 'es2015' ]
                }
            },


            { test: /\.less$/,  loader: ExtractTextPlugin.extract('css-loader!less-loader?sourceMap') },
            { test: /\.css$/,   loader: ExtractTextPlugin.extract('css-loader?sourceMap') },  
            { test: /\.png$/,   loader: 'file-loader?name=../images/[hash].[ext]' },
            { test: /\.svg$/,   loader: 'file-loader?name=../images/[hash].[ext]' },
            { test: /\.ttf$/,   loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.eot$/,   loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.woff$/,  loader: 'file-loader?name=../fonts/[hash].[ext]' },
            { test: /\.woff2$/, loader: 'file-loader?name=../fonts/[hash].[ext]' }
        ]
    }
};

var stylelintConfig = {
    "rules": {
        "block-no-empty": null,
        "color-no-invalid-hex": true,
        "comment-empty-line-before": [ "always", {
        "ignore": ["stylelint-commands", "between-comments"]
        } ],
        "declaration-colon-space-after": "always",
        "indentation": ["tab", {
        "except": ["value"]
        }],
        "max-empty-lines": 2,
        "rule-nested-empty-line-before": [ "always", {
        "except": ["first-nested"],
        "ignore": ["after-comment"]
        } ],
        "unit-whitelist": ["em", "rem", "%", "s"]
    },

    reporters: [
        { formatter: 'string', console: true }
    ]
};

var compiler = webpack(webpackConfig);

var bootstrap = {
    less: 'bower_components/bootstrap/less/bootstrap.less'
};

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'));
});

gulp.task('images', ['clean', 'bower', 'sprite'], function () {
    return gulp.src(conf.images)
        .pipe(gulpif(argv.env === 'production', imagemin()))
        .pipe(gulp.dest(conf.build.images))
});

gulp.task('sprite', ['clean'], function () {
    return gulp.src(conf.icons)
        .pipe(spritesmith(conf.sprite))
        .pipe(gulp.dest('src/'));
});

gulp.task('html', ['clean'], function () {
    return gulp.src(conf.html)
        .pipe(htmlreplace({
            'css': '../css/cdp.css',
            'js': '../js/cdp.js',
            'logo': {
                src: '../images/logo_gray-blue_80px.svg',
                tpl: '<img src="%s" alt="Epam logo"/>'
            }
        }))
        .pipe(gulp.dest(conf.build.html));
});

gulp.task('bundle', ['clean', 'bower', 'images'], function () {
    return compiler.run(function () {});
});

gulp.task('bundle:prod', ['clean', 'bower', 'images'], function () {
    webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());

    gulp.run('bundle');
});

gulp.task('clean', function () {
    return del([conf.build.folder, conf.build.tmpFolders]);
});

gulp.task('build', ['html', 'bundle']);
gulp.task('build:prod', ['html', 'bundle:prod']);

gulp.task('watch', ['build'], function () {
    return gulp.watch(conf.less, ['style-watch']);
});

gulp.task('watch-bundle', function () {
    return (new WebpackDevServer(compiler)).listen(8080);
});

gulp.task('lint:scripts', function () {
    return gulp.src([
            './src/**/*.js'
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint:styles', function () {
    return gulp.src([
            './src/**/*.css'
        ])
        .pipe(stylelint(stylelintConfig));
});

gulp.task('lint', [ 'lint:scripts', 'lint:styles' ]);

function errorHandler(error) {
    util.log(util.colors.red('Error'), error.message);

    this.end();
}
