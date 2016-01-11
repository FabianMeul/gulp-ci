// CI: Packages.js
// ---
// Install dependencies for your project

var gulp = require("gulp");
var webserver = require("gulp-webserver");
var bower = require("gulp-bower");

// Load the build configuration
var config = require("./config/config.json");

// Install bower dependencies
gulp.task("bower", function() {
    // Return a stream to support async
    return bower();
});
