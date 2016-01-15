// CI: Build.js
// ---
// Build all resources to a minified dist folder
//
// Used NPM packages in this file
//
// "gulp": "^3.9.0",
// "gulp-concat": "^2.6.0",
// "gulp-cssnano": "^2.1.0",
// "gulp-filesize": "0.0.6",
// "gulp-filter": "^3.0.1",
// "gulp-html-replace": "^1.5.5",
// "gulp-imagemin": "^2.4.0",
// "gulp-jshint": "^1.11.2",
// "gulp-rename": "^1.2.2",
// "gulp-replace": "^0.5.4",
// "gulp-ruby-sass": "^1.0.5",
// "gulp-uglify": "^1.5.1",
// "gulp-util": "^3.0.7",
// "run-sequence": "^1.1.5"

"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util"); // https://github.com/gulpjs/gulp-util
var replace = require("gulp-replace"); // https://www.npmjs.com/package/gulp-replace
var gulpFilter = require("gulp-filter"); // https://www.npmjs.com/package/gulp-filter
var concat = require("gulp-concat"); // https://github.com/contra/gulp-concat
var uglify = require("gulp-uglify"); // https://www.npmjs.com/package/gulp-uglify
var cssNano = require("gulp-cssnano"); // https://github.com/ben-eb/gulp-cssnano
var rename = require("gulp-rename"); // https://github.com/hparra/gulp-rename
var htmlReplace = require("gulp-html-replace"); // https://github.com/VFK/gulp-html-replace

var imageMin = require("gulp-imagemin"); // https://www.npmjs.com/package/gulp-imagemin

var mainBowerFiles = require("main-bower-files"); // https://github.com/ck86/main-bower-files
var del = require("del"); // https://www.npmjs.com/package/del
var runSequence = require("run-sequence"); // https://www.npmjs.com/package/run-sequence

// Load the build configuration
var config = require("./config/config.json");

// Load the build Helper
var buildHelper = require("./build-helpers.js");


// Clean up the deploy folder
gulp.task("clean", function(callback) {
    var patterns = [
        config.env.dist.serve.dir + "**/*"
    ];

    return del(patterns);
});

// Compress and concatenate scripts
gulp.task("compressScripts", function(callback) {
    var patterns = [
        // Custom scripts
        config.env.dev.serve.dir + "app/app.module.js",
        config.env.dev.serve.dir + "app/app.config.js",
        config.env.dev.serve.dir + "app/app.router.js",
        config.env.dev.serve.dir + "app/**/*.js",

        // Exclude vendor scripts
        "!" + buildHelper.bowerConfig().directory + "/**/*"
    ];

    // Destination folder
    var destination = config.env.dist.serve.dir + "app";

    return gulp.src(patterns)
        .pipe(concat("app-" + buildHelper.timestamp + ".js"))
        .pipe(gulp.dest(destination))
        .pipe(uglify())
        .pipe(rename("app-" + buildHelper.timestamp + ".min.js"))
        .pipe(gulp.dest(destination))
        .on("error", gutil.log);
});

// Compress images
gulp.task("compressImages", function(callback) {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "assets/img/**/*"
    ];

    // ImageMin options
    var options = {
        progressive: true,
        optimizationLevel: 5
    };

    // File destination
    var destination = config.env.dist.serve.dir + "assets/img/";

    return gulp.src(patterns)
        .pipe(imageMin(options))
        .pipe(gulp.dest(destination));
});

// Compress and concatenate vendor scripts
gulp.task("compressBower", function(callback) {

    var scriptsFilter = gulpFilter("**/*.js", { restore: true });
    var stylesFilter = gulpFilter("**/*.css", { restore: true });

    var scriptsDestination = config.env.dist.serve.dir + "app/";
    var stylesDestination = config.env.dist.serve.dir + "assets/css/";

    return gulp.src(mainBowerFiles())

        // Concat and compress scripts
        .pipe(scriptsFilter)
        .pipe(concat("vendor-" + buildHelper.timestamp + ".js"))
        .pipe(gulp.dest(scriptsDestination))
        .pipe(uglify())
        .pipe(rename("vendor-" + buildHelper.timestamp + ".min.js"))
        .pipe(gulp.dest(scriptsDestination))
        .pipe(scriptsFilter.restore)

        // Concat and compress styles
        .pipe(stylesFilter)
        .pipe(concat("vendor-" + buildHelper.timestamp + ".css"))
        .pipe(gulp.dest(stylesDestination))
        .pipe(cssNano())
        .pipe(rename("vendor-" + buildHelper.timestamp + ".min.css"))
        .pipe(gulp.dest(stylesDestination))
        .pipe(stylesFilter.restore)

        .on("error", gutil.log);
});

// Copy fonts into the dist directory
gulp.task("copy-fonts", function(callback) {

    // Globbing patterns
    var patterns = [
        buildHelper.bowerConfig().directory + "/font-awesome/fonts/*"
    ];

    // Destination
    var destination = config.env.dist.serve.dir + "assets/fonts/";

    return gulp.src(patterns)
        .pipe(gulp.dest(destination));
});

// Copy the templates into the dist directory
gulp.task("copy-templates", function(callback) {
    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "/app/**/*.html",
        "!" + buildHelper.bowerConfig().directory + "**/*"
    ];

    // Destination
    var destination = config.env.dist.serve.dir + "app/";

    return gulp.src(patterns)
        .pipe(gulp.dest(destination));
});

// Copy index.html and replace some values
gulp.task("build-html", function(callback) {

    // Source
    var source = config.env.dev.serve.dir + "index.html";

    // HTML Replace options
    var options = {
        "css": [
            "/assets/css/vendor-" + buildHelper.timestamp + ".min.css",
            "/assets/css/styles-" + buildHelper.timestamp + ".min.css"
        ],
        "js": [
            "/app/vendor-" + buildHelper.timestamp + ".min.js",
            "/app/app-" + buildHelper.timestamp + ".min.js"
        ]
    };

    // Destination
    var destination = config.env.dist.serve.dir;

    return gulp.src(source)
        .pipe(htmlReplace(options))
        .pipe(gulp.dest(destination));
});

// Save the timestamp in the server config file
gulp.task("saveTimestamp", function(callback) {

    // Globbing pattern
    var source = "./config/env/all.js";

    return gulp.src(source)
        .pipe(replace(/(?:buildTimestamp: )+(\d)*/g, "buildTimestamp: " + buildHelper.timestamp))
        .pipe(gulp.dest("./config/env/"));
});


gulp.task("build", function(callback) {
    runSequence(
        "clean",
        ["compressScripts", "compressImages", "build-styles", "compressBower", "copy-fonts", "copy-templates"],
        "saveTimestamp",
        "build-html",
        callback
    );
});
