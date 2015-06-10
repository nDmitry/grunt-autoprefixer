'use strict';

var path = require('path');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer-core');
var diff = require('diff');
var chalk = require('chalk');

module.exports = function(grunt) {

    var options;
    var prefixer;

    /**
     * Returns an input map contents if a custom map path was specified
     * @param {string} from Input CSS path
     * @returns {?string}
     */
    function getPrevMap(from) {
        if (typeof options.map.prev === 'string') {
            var mapPath = options.map.prev + path.basename(from) + '.map';

            if (grunt.file.exists(mapPath)) {
                return grunt.file.read(mapPath);
            }
        }
    }

    /**
     * @param {string} input Input CSS contents
     * @param {string} from Input CSS path
     * @param {string} to Output CSS path
     * @returns {{css: string, map: ?string}}
     */
    function prefix(input, from, to) {
        return prefixer.process(input, {
            map: (typeof options.map === 'boolean') ? options.map : {
                prev: getPrevMap(from),
                inline: (typeof options.map.inline === 'boolean') ? options.map.inline : true,
                annotation: (typeof options.map.annotation === 'string') ? options.map.annotation : true,
                sourcesContent: (typeof options.map.sourcesContent === 'boolean') ? options.map.sourcesContent : true
            },
            from: from,
            to: to,
            safe: options.safe
        });
    }

    /**
     * @param {string} msg Log message
     */
    function log(msg) {
        grunt.verbose.writeln(msg);
    }

    grunt.registerMultiTask('autoprefixer', 'Prefix CSS files.', function() {
        options = this.options({
            browsers: undefined,
            cascade: true,
            diff: false,
            map: false,
            remove: true,
            safe: false
        });

        var tally = {
            sheets: 0,
            maps: 0,
            diffs: 0
        };

        prefixer = postcss([autoprefixer({
            browsers: options.browsers,
            cascade: options.cascade,
            remove: options.remove
        })]);

        var done = this.async();
        var finished = 0;
        var processed = this.files.length;

        if (!this.files.length) {
            done();
        }

        this.files.forEach(function(f) {
            var src = f.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file ' + chalk.cyan(filepath) + ' not found.');

                    return false;
                }

                return true;
            });

            if (src.length === 0) {
                grunt.log.error('No source files were found.');

                return done();
            }

            src.forEach(function(filepath) {
                var dest = f.dest || filepath;
                var input = grunt.file.read(filepath);

                prefix(input, filepath, dest).then(function(result) {
                    result.warnings().forEach(function (msg) {
                        grunt.log.error(msg.toString());
                    });

                    grunt.file.write(dest, result.css);
                    log('File ' + chalk.cyan(dest) + ' created.');
                    tally.sheets++;

                    if (result.map) {
                        grunt.file.write(dest + '.map', result.map.toString());
                        log('File ' + chalk.cyan(dest + '.map') + ' created (source map).');
                        tally.maps++;
                    }

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : dest + '.diff';

                        grunt.file.write(diffPath, diff.createPatch(dest, input, result.css));
                        log('File ' + chalk.cyan(diffPath) + ' created (diff).');
                        tally.diffs++;
                    }

                    finished += 1;

                    if (finished === processed) {
                        if (tally.sheets) {
                            grunt.log.ok(tally.sheets + ' ' + 'autoprefixed ' + grunt.util.pluralize(tally.sheets, 'stylesheet/stylesheets') + ' created.');
                        }

                        if (tally.maps) {
                            grunt.log.ok(tally.maps + ' ' + grunt.util.pluralize(tally.maps, 'sourcemap/sourcemaps') + ' created.');
                        }

                        if (tally.diffs) {
                            grunt.log.ok(tally.diffs + ' ' + grunt.util.pluralize(tally.diffs, 'diff/diffs') + ' created.');
                        }

                        done();
                    }
                }).catch(function (error) {
                    if (error.name === 'CssSyntaxError') {
                        grunt.fatal(error.message + error.showSourceCode());
                    } else {
                        grunt.fatal(error);
                    }
                });
            });
        });
    });
};
