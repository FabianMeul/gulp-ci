// CI: Styles.js
// ---
// Render styles

var gulp = require("gulp");
var gutil = require("gulp-util"); // https://github.com/gulpjs/gulp-util
var sass = require("gulp-sass"); // https://www.npmjs.com/package/gulp-sass
var sassGlob = require("gulp-sass-glob"); // https://www.npmjs.com/package/gulp-sass-glob
var sourcemaps = require("gulp-sourcemaps"); // https://www.npmjs.com/package/gulp-sourcemaps
var rename = require("gulp-rename"); // https://github.com/hparra/gulp-rename

// PostCSS + plugins
var postcss = require("gulp-postcss"); // https://github.com/postcss/gulp-postcss
var autoprefixer = require("autoprefixer"); //https://github.com/postcss/autoprefixer
var cssnano = require("cssnano"); // https://github.com/ben-eb/cssnano

// Load the build configuration
var config = require("./config/config.json");

// Load the build Helper
var buildHelper = require("./build-helpers.js");

var compileStyles = function compileStyles(env) {

    // Source
    var source = config.env.dev.sass.dir + config.env.dev.sass.files;
    var destination = config.env[env].styles.dir;

    // Sass options
    var options = {
        outputStyle: "expanded",
        includePaths: [
            // Include bower packages as a souce for @import statements
            buildHelper.absolutePath() + buildHelper.bowerConfig().directory
        ]
    };

    // Sourcemap options
    var sourcemapOptions = {
        includeContent: false,
        sourceRoot: "../../scss"
    };

    // PostCSS processors
    var processors = [
        // Autoprefix
        autoprefixer({ browsers: ["last 3 versions"] }),
        // Minify
        cssnano()
    ];

    return gulp.src(source)
        .pipe(sourcemaps.init())
        // Glob sass files
        .pipe(sassGlob())
        // Compile sass
        .pipe(sass(options).on("error", sass.logError))
        // Run PostCSS processing
        .pipe(postcss(processors))
        // Rename the generated CSS file
        .pipe(rename(buildHelper.addTimestamp("styles", ".min.css")))
        .pipe(sourcemaps.write("sourcemap", sourcemapOptions))
        // Save CSS files
        .pipe(gulp.dest(destination));
};


// Compile sass
gulp.task("styles", function() {
    return compileStyles(buildHelper.environment);
});
