// CI: Packages.js
// ---
// Install dependencies for your project

var gulp = require("gulp");
var webserver = require("gulp-webserver");
var bower = require("gulp-bower");
var wiredep = require("wiredep").stream;

// Load the build configuration
var config = require("./config/config.json");

// Load the build Helper
var buildHelper = require("./build-helpers.js");

// Install bower dependencies
gulp.task("bower", function() {
    // Return a stream to support async
    return bower()
        .on('error', buildHelper.onError);
});

// Bower integration
gulp.task("wiredep", function () {

    // Source
    var source = config.env.dev.serve.dir = "index.html";

    // Wiredep options
    var options = {
        directory: buildHelper.bowerConfig().directory,
        fileTypes: {
            html: {
              block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
              detect: {
                js: /<script.*src=[""]([^""]+)/gi,
                css: /<link.*href=[""]([^""]+)/gi
              },
              replace: {
                js: "<script src=\"{{filePath}}\"></script>",
                css: "<link rel=\"stylesheet\" href=\"/{{filePath}}\" />"
              }
            },
        }
    };

    var destination = config.env.dev.serve.dir;

    return gulp.src(source)
        .pipe(wiredep(options))
        .pipe(gulp.dest(destination));
    });
