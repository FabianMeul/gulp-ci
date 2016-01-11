// CI: Linting.js
// ---
// Check the source files for consistency and style.

var gulp = require("gulp");
var esLint = require("gulp-eslint");
var sassLint = require("gulp-sass-lint");

// Load the build configuration
var config = require("./config/config.json");

// Load the build Helper
var buildHelper = require("./build-helpers.js");

// Lint scripts
gulp.task("lint-scripts", function() {

    // Globbing patterns
    var patterns = [
        config.builds.dev.dir + "app/**/*.js",
        "!" + buildHelper.bowerConfig().directory + "**/*.js"
    ];

    return gulp.src(patterns)
        .pipe(esLint())
        .pipe(esLint.format())
});

// Lint styles
gulp.task("lint-styles", function() {

    // Globbing patterns
    var patterns = [
        config.builds.dev.dir + '/sass/**/*.s+(a|c)ss'
    ];

    return gulp.src(patterns)
        .pipe(sassLint())
        .pipe(sassLint.format());
});
