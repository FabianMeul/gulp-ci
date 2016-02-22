// CI: Angular - Gettext.js
// ---
// Gettext implementation for translations

var gulp = require("gulp");
var angularGettext = require("angular-gettext");

// Load the build Helper
var buildHelper = require("./build-helpers.js");


// Create pot file of all translations
gulp.task("pot", function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "app/**/*.{js|html}",
        "!" + buildHelper.bowerConfig().directory
    ];

    // Angular gettext options
    var options = {};

    // Destination
    var destination = config.env.dev.serve.dir + "/assets/translations/pot";

    return gulp.src(patterns)
        .pipe(angularGettext.extract("template.pot", options))
        .pipe(gulp.dest(destination));
});

// Create json translations from the created PO files
gulp.task("translations", function() {

    // Globbing patterns
    var patterns = [
        config.env.dev.serve.dir + "assets/translations/po/**/*.po"
    ];

    // Angular gettext options
    var options = {
        format: "json"
    };

    // Destination
    var destination = config.env.dev.serve.dir + "/assets/translations/json";

    return gulp.src(patterns)
        .pipe($.angularGettext.compile(options))
        .pipe(gulp.dest(destination));
});
