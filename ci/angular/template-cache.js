// CI: Angular - Template Cache.js
// ---
// Create a template cache for AngularJS Projects

var gulp = require("gulp");
var gUtil = require("gulp-util");
var templateCache = require("gulp-angular-templatecache");

// Load the build configuration
var config = require("./../config/config.json");

gulp.task('angular:template-cache', function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "app/**/*.html"
    ];

    // TemplateCache options
    var options = {};
    if (config.template-cache) {
        options = {
            module: config.template-cache.module
        };
    } else {
        gUtil.log('No angular-template-cache configuration was found. This might be an error, so we\'re letting you know ;-).');
    }

    var destination = config.env.dist.serve.dir + "app";

    return gulp.src(patterns)
        .pipe(templateCache(options))
        .pipe(gulp.dest(destination));
});
