//
// CI: Scripts: TypeScript
// ---
// Gulp tasks for compiling TypeScript.
//

var gulp = require("gulp");
var ts = require("gulp-typescript"); // https://github.com/ivogabe/gulp-typescript
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");

gulp.task("scripts:typescript", function() {
    var tsResult = gulp.src("lib/*.ts")
                       .pipe(sourcemaps.init()) // This means sourcemaps will be generated
                       .pipe(ts({
                           sortOutput: true,
                           // ...
                       }));

    return tsResult.js
                .pipe(concat("output.js")) // You can use other plugins that also support gulp-sourcemaps
                .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
                .pipe(gulp.dest("release/js"));
});
