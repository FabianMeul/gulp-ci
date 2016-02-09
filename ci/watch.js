// CI: Watch.js
// ---
// Watch file changes and run the related tasks

var gulp = require("gulp");

// Load CI components
var templateCache = require('./angular/template-cache.js');

// Load the build configuration
var config = require("./config/config.json");

// A bundled "watch" task
gulp.task("watch", ["watch-styles", "watch-scripts"]);

// Watch styles
gulp.task("watch-styles", function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.sass.dir + config.env.dev.sass.files
    ];

    gulp.watch(patterns, function() {
        gulp.run("styles");
    });
});

// Watch scripts
gulp.task("watch-scripts", function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "app/**/*.js"
    ];

    gulp.watch(patterns, function() {
       gulp.run("lint-scripts");
    });
});

// Watch the templates
gulp.task("watch-templates", function() {

    // Globbing patterns
    var patterns = [
        config.env.serve.dir + "app/**/*.html"
    ];

    gulp.watch(patterns, function() {
        gulp.run("angular:template-cache");
    });
});
