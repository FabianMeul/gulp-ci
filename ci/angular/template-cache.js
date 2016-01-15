// CI: Angular - Template Cache.js
// ---
// Create a template cache for AngularJS Projects

var gulp = require("gulp");
var templateCache = require("gulp-angular-templatecache");

// Load the build configuration
var config = require("./../config/config.json");

gulp.task('angular:template-cache', function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "app/**/*.html"
    ];

    // TemplateCache options
    var options = {
        module: config.template-cache.module
    };

    var destination = config.env.dist.serve.dir + "app";

    return gulp.src(patterns)
        .pipe(templateCache())
        .pipe(gulp.dest())
});
