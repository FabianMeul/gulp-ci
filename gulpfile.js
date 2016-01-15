// Gulpfile.js
// ---
// The main Gulpfile binds all of the different CI components together.
// The components are all set up to run independent from each other.
//
// CLI Parameters:
// --env {{value}} // Set the environment context.

"use strict";

var gulp = require("gulp"),
    linting = require("./ci/linting"),
    build = require("./ci/build"),
    serve = require("./ci/serve"),
    packages = require("./ci/packages"),
    styles = require("./ci/styles"),
    watch = require("./ci/watch"),
    angularTemplateCache = require("./ci/angular/template-cache"),
    buildHelper = require("./ci/build-helpers"),

    runSequence = require("run-sequence"), // https://www.npmjs.com/package/run-sequence
    //serverConfig = require("./config/config.js"),

    onError = function onError(err) {
        console.log(err);
    };

// Load the build Helper
var buildHelper = require("./ci/build-helpers.js");

gulp.task("default", function(callback) {
    runSequence(
        "bower",
        ["serve", "sass", "wiredep", "lint-scripts", "watch"]
    );
});

// Digipolis Gulp Production task: "package"
gulp.task("package", function(callback) {
    runSequence(
        "bower",
        "wiredep",
        "build",
        callback
    );
});
