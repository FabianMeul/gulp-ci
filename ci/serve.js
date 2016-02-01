// CI: Serve.js
// ---
// Serve the project files using a webserver.

var gulp = require("gulp");
var gUtil = require("gulp-util");
var webserver = require("gulp-webserver");

// Load the build Helper
var buildHelper = require("./build-helpers.js");

// Load the build configuration
var config = require("./config/config.json");

// Options for the webserver
var webserverOptions = {
    livereload: {
        enable: true,
        port: 1337
    },
    port: 8111,
    directoryListing: false,
    open: true,
    host: "0.0.0.0",
    fallback: "index.html"
};

// Serve the environment
// Choose a different environment in CLI using "--env {{value}}"
// The value of --env defaults to "dev"
gulp.task("serve", function() {

    // Source
    var source = config.env.dev.serve.dir;

    // Set the default port on which to serve the project
    webserverOptions.port = config.env.dev.serve.port;

    if (config.env[buildHelper.environment] && config.env[buildHelper.environment].serve.proxies) {
        // Add this in the config.json
        // "proxies": [
        //     {
        //         "source": "/",
        //         "target": "127.0.0.1",
        //         "options": {}
        //     }
        // ]
        webserverOptions.proxies = config.env[buildHelper.environment].serve.proxies;
    }

    // Set the parameters based on the environment
    if (buildHelper.environment === "dist") {
        source = config.env.dist.serve.dir;
        webserverOptions.port = config.env.dist.serve.port;
    }

    return gulp.src(source)
        .pipe(webserver(webserverOptions));
});
