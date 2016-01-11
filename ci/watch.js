// CI: Watch.js
// ---
// Watch file changes and run the related tasks

var gulp = require("gulp");

// Load the build configuration
var config = require("./config/config.json");

// A bundled "watch" task
gulp.task("watch", ["watch-styles", "watch-scripts"]);

// Watch styles
gulp.task("watch-styles", function() {

    // Globbing patterns
    var patterns = [
        config.builds.dev.dir + "assets/scss/**/*.scss"
    ];

    gulp.watch(patterns, function() {
        gulp.run("sass");
    });
});

// Watch scripts
gulp.task("watch-scripts", function() {

    // Globbing patterns
    var patterns = [
        config.builds.dev.dir + "app/**/*.js"
    ];

    gulp.watch(patterns, function() {
       gulp.run("lint-scripts");
    });
});

// Watch the templates
gulp.task("watch-templates", function() {

    // Globbing patterns
    var patterns = [
        config.builds.dev.dir + "app/**/*.html"
    ];

    gulp.watch(patterns, function() {
    });
});
