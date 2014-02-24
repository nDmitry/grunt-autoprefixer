'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var diff = require('diff');
var chalk = require('chalk');

module.exports = function(grunt) {

    var options;
    var prefixer;

    /**
     * Returns an input source map if a map path was specified
     * or options.map value otherwise
     * @param {string} from
     * @returns {string|boolean|undefined}
     */
    function getMapOption(from) {
        if (typeof options.map === 'string') {
            var mapPath = options.map + path.basename(from) + '.map';

            if (grunt.file.exists(mapPath)) {
                return grunt.file.read(mapPath);
            }
        }

        return options.map;
    }

    /**
     * Create diff and write it to a destination or specified folder
     * @param {string} to
     * @param {string} input Input CSS
     * @param {string} output Prefixed CSS
     */
    function writeDiff(to, input, output) {
        var diffPath = (typeof options.diff === 'string') ? options.diff : to + '.patch';

        grunt.file.write(diffPath, diff.createPatch(to, input, output));
    }

    /**
     * @param {string} input Input CSS
     * @param {string} from Input path
     * @param {string} to Output path
     * @returns {{css: string, map?: string}}
     */
    function prefix(input, from, to) {
        var output = prefixer.process(input, {
            map: getMapOption(from),
            inlineMap: options.mapInline,
            from: from,
            to: to
        });

        return output;
    }

    grunt.registerMultiTask('autoprefixer', 'Prefix CSS files.', function() {
        options = this.options({
            cascade: false,
            diff: false,
            map: undefined,
            mapInline: undefined
        });

        prefixer = autoprefixer(options.browsers, {cascade: options.cascade});

        this.files.forEach(function(f) {
            f.src
                .filter(function(filepath) {

                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                })
                .forEach(function(filepath) {
                    var dest = f.dest || filepath;
                    var input = grunt.file.read(filepath);
                    var output = prefix(input, filepath, dest);

                    grunt.file.write(dest, output.css);
                    output.map && grunt.file.write(dest + '.map', output.map);
                    options.diff && writeDiff(dest, input, output.css);
                    grunt.log.writeln('File ' + chalk.cyan(dest) + ' prefixed.');
                });
        });
    });
};
