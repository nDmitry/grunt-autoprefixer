'use strict';

var path = require('path');
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

        prefixer = autoprefixer({browsers: options.browsers, cascade: options.cascade, remove: options.remove});

        this.files.forEach(function(f) {
            if (!f.src.length) {
                return grunt.fail.warn('No source files were found.');
            }

            try {
                f.src.forEach(function(filepath) {
                    var dest = f.dest || filepath;
                    var input = grunt.file.read(filepath);
                    var output = prefix(input, filepath, dest);

                    grunt.file.write(dest, output.css);
                    log('File ' + chalk.cyan(dest) + ' created.');
                    tally.sheets++;

                    if (output.map) {
                        grunt.file.write(dest + '.map', output.map.toString());
                        log('File ' + chalk.cyan(dest + '.map') + ' created (source map).');
                        tally.maps++;
                    }

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : dest + '.diff';

                        grunt.file.write(diffPath, diff.createPatch(dest, input, output.css));
                        log('File ' + chalk.cyan(diffPath) + ' created (diff).');
                        tally.diffs++;
                    }
                });
            } catch (e) {
                grunt.fail.fatal(e);
            }
        });

        if (tally.sheets) {
            grunt.log.ok(tally.sheets + ' ' + 'autoprefixed ' + grunt.util.pluralize(tally.sheets, 'stylesheet/stylesheets') + ' created.');
        }

        if (tally.maps) {
            grunt.log.ok(tally.maps + ' ' + grunt.util.pluralize(tally.maps, 'sourcemap/sourcemaps') + ' created.');
        }

        if (tally.diffs) {
            grunt.log.ok(tally.diffs + ' ' + grunt.util.pluralize(tally.diffs, 'diff/diffs') + ' created.');
        }
    });
};
