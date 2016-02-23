//
// CI: Scripts: Babel
// ---
// BabelJS transpiling to ES5.
// This Gulpfile is written in ES6, #yolo.
//
"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import sourcemaps from "gulp-sourcemaps";
import concat from "gulp-concat";

// Load the build configuration
import config from "./../config/config.json";
import buildHelper from "./../build-helpers.js";

// Transpile ES6 to classic ES5
gulp.task("scripts:babel", () => {
    // Globbing patterns
    let patterns = [
        config.env.dev.scripts.dir + "**/*.js",
    ];

    let babelOptions = {
        presets: ["es2015"]
    };

    // Destination
    let destination = config.env.dev.scripts.dir;

    return gulp.src(patterns)
        .pipe(sourcemaps.init())
        .pipe(babel(babelOptions))
        .pipe(concat("all.js")) // TODO: Fix output name
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(destination));
});
