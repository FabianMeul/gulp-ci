// CI: Styles.js
// ---
// Render styles

var gulp = require("gulp");
var gutil = require("gulp-util"); // https://github.com/gulpjs/gulp-util
var autoprefixer = require("gulp-autoprefixer"); // https://www.npmjs.com/package/gulp-autoprefixer
var sass = require("gulp-sass"); // https://www.npmjs.com/package/gulp-sass
var sassGlob = require("gulp-sass-glob"); // https://www.npmjs.com/package/gulp-sass-glob
var sourcemaps = require("gulp-sourcemaps"); // https://www.npmjs.com/package/gulp-sourcemaps
var rename = require("gulp-rename"); // https://github.com/hparra/gulp-rename

// Load the build configuration
var config = require("./config/config.json");

// Load the build Helper
var buildHelper = require("./build-helpers.js");


// Compile sass
gulp.task("styles", function() {

    // Source
    var source = config.env.dev.serve.dir + "assets/scss/**/*.scss";
    var destination = config.env.dev.serve.dir + "assets/css/";

    // Sass options
    var options = {
        outputStyle: "expanded",
        includePaths: [
            // Include bower packages as a souce for @import statements
            buildHelper.bowerConfig().directory // TODO: Fix import path
        ]
    };

    // Sourcemap options
    var sourcemapOptions = {
        includeContent: false,
        sourceRoot: "../../scss"
    };

    return gulp.src(source)
        .on("error", gutil.log)
        .pipe(sourcemaps.init())
        // Glob sass files
        .pipe(sassGlob())
        // Compile sass
        .pipe(sass(options))
        // Autoprefix the generated CSS file
        .pipe(autoprefixer("last 3 versions"))
        .pipe(sourcemaps.write("sourcemap", sourcemapOptions))
        // Save CSS files
        .pipe(gulp.dest(destination));
});

// Build sass
// Compile and compress the styles.
// No sourcemap is generated.
gulp.task("build-styles", function() {
    // Source
    var source = config.env.dev.serve.dir + "assets/scss/**/*.scss";
    var destination = config.env.dist.serve.dir + "assets/css/";

    // Sass options
    var options = {
        outputStyle: "compressed",
        includePaths: [
            // Include bower packages as a souce for @import statements
            buildHelper.bowerConfig().directory // TODO: Fix import path
        ]
    };

    return gulp.src(source)
        .on("error", gutil.log)
        // Glob sass files
        .pipe(sassGlob())
        // Compile sass
        .pipe(sass(options))
        // Autoprefix the generated CSS file
        .pipe(autoprefixer("last 3 versions"))
        // Rename the generated CSS file
        .pipe(rename("styles-" + buildHelper.timestamp + ".min.css"))
        // Save CSS files
        .pipe(gulp.dest(destination));
});
