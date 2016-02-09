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

// Return the absolute path of the project
var absolutePath = function absolutePath() {
    return __dirname + "/../";
};

// Create a timestamp for the build
var timestamp = new Date() / 1;

var addTimestamp = function addTimestamp(prefix, suffix) {
    this.path = "";

    if (environment !== "dev" && !noTimestamp) {
        this.path = prefix + "-" + timestamp + suffix;
    } else {
        this.path = prefix + suffix;
    }

    return this.path;
};

// Set the environment context
var environment = gUtil.env.env || "dev";
var noTimestamp = gUtil.env.noTimestamp || true;

// Generic error logger
var onError = function onError(err) {
    gUtil.log(gUtil.colors.bgRed.white("An error occured:"), gUtil.colors.red(err.message));
    this.emit("end");
};

// Exposed properties
module.exports.bowerConfig = bowerConfig;
module.exports.timestamp = timestamp;
module.exports.environment = environment;

// Exposed functions
module.exports.absolutePath = absolutePath;
module.exports.addTimestamp = addTimestamp;
module.exports.onError = onError;
