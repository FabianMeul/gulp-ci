// CI: Build-helpers.js
// ---
// Helper functions for building a project

var gUtil = require("gulp-util");

var path = require("path");
var fs = require("fs");

var _bowerConfig = "";

// Cache the path once it's been loaded
var bowerConfig = function bowerConfig() {

    if (_bowerConfig.length === 0) {
        try {
            this.bowerFile = fs.readFileSync(path.join(__dirname + "/../.bowerrc"), "utf8");
        } catch (e) {
            // Make sure the script doesn't crash if no file is found.
            gUtil.log('No .bowerrc file was found. The file contents cannot be used to exclude files from compilation.');
            return "";
        };
        _bowerConfig = JSON.parse(this.bowerFile);
        _bowerConfig.directory += "/";
    }

    return _bowerConfig;
};

// Create a timestamp for the build
var timestamp = new Date() / 1;

// Set the environment context
var environment = gUtil.env.env || "dev";

// Generic error logger
var onError = function onError(err) {
    gUtil.log(gUtil.colors.bgRed.white("An error occured:"), gUtil.colors.red(err.message));
    this.emit("end");
};

// Exposed properties
module.exports.bowerConfig = bowerConfig;
module.exports.timestamp = timestamp;
module.exports.environment = environment;
module.exports.onError = onError;
