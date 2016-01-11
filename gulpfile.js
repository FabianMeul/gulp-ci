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
    buildHelper = require("./ci/build-helpers"),

    runSequence = require("run-sequence"), // https://www.npmjs.com/package/run-sequence
    wiredep = require("wiredep").stream,
    //serverConfig = require("./config/config.js"),

    developmentRoot = "./public/dev",
    onError = function onError(err) {
        console.log(err);
    };

// Load the build Helper
var buildHelper = require("./ci/build-helpers.js");

// Bower integration
gulp.task("wiredep", function () {
  gulp.src(developmentRoot+"/index.html")
    .pipe(wiredep({
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
    }))
    .pipe(gulp.dest(developmentRoot));
});

// Create pot file of all translations
gulp.task("pot", function() {
    return gulp.src([
            developmentRoot + "/app/**/*.html",
            developmentRoot + "/app/components/**/*.js",
            developmentRoot + "/app/core/**/*.js",
            developmentRoot + "/app/directives/**/*.js",
            developmentRoot + "/app/factories/**/*.js",
            developmentRoot + "/app/modules/**/*.js",
            developmentRoot + "/app/services/**/*.js",
            !developmentRoot + "/app/bower_components"
        ])
        .pipe($.angularGettext.extract("template.pot", {
            // Extra options?
        }))
        .pipe(gulp.dest(developmentRoot + "/assets/translations/pot"));
});

gulp.task("translations", function() {
    return gulp.src(developmentRoot + "/assets/translations/po/**/*.po")
        .pipe($.angularGettext.compile({
            format: "json"
        }))
        .pipe(gulp.dest(developmentRoot + "/assets/translations/json"));
});

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
