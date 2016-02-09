// CI: Styles.js
// ---
// Render styles

var gulp = require("gulp");
var gutil = require("gulp-util"); // https://github.com/gulpjs/gulp-util
var autoprefixer = require("gulp-autoprefixer"); // https://www.npmjs.com/package/gulp-autoprefixer
var cssNano = require("gulp-cssnano"); // https://github.com/ben-eb/gulp-cssnano
var sass = require("gulp-sass"); // https://www.npmjs.com/package/gulp-sass
var sassGlob = require("gulp-sass-glob"); // https://www.npmjs.com/package/gulp-sass-glob
var sourcemaps = require("gulp-sourcemaps"); // https://www.npmjs.com/package/gulp-sourcemaps
var rename = require("gulp-rename"); // https://github.com/hparra/gulp-rename

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

    return gulp.src(source)
        .pipe(sourcemaps.init())
        // Glob sass files
        .pipe(sassGlob())
        // Compile sass
        .pipe(sass(options).on("error", sass.logError))
        // Autoprefix the generated CSS file
        .pipe(autoprefixer("last 3 versions"))
        // Minify the CSS file
        .pipe(cssNano())
        // Rename the generated CSS file
        .pipe(rename(buildHelper.addTimestamp("styles", ".min.css")))
        .pipe(sourcemaps.write("sourcemap", sourcemapOptions))
        // Save CSS files
        .pipe(gulp.dest(destination));
}


// Compile sass
gulp.task("styles", function() {
    return compileStyles(buildHelper.environment);
});
