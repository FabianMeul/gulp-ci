// Gulpfile.js
// ---
// The main Gulpfile binds all of the different CI components together.
// The components are all set up to run independent from each other.
//
// CLI Parameters:
// --env {{value}} // Set the environment context.

"use strict";

var gulp = require("gulp");
var linting = require("./ci/linting");
var build = require("./ci/build");
var serve = require("./ci/serve");
var packages = require("./ci/packages");
var styles = require("./ci/styles");
var watch = require("./ci/watch");
var angularTemplateCache = require("./ci/angular/template-cache");
var babel = require("./ci/scripts/babel");
var buildHelper = require("./ci/build-helpers");

var runSequence = require("run-sequence"); // https://www.npmjs.com/package/run-sequence

// Load the build Helper
var buildHelper = require("./ci/build-helpers.js");

gulp.task("default", function(callback) {
    runSequence(
        "bower",
        ["serve", "styles", "wiredep", "lint-scripts", "watch"]
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
