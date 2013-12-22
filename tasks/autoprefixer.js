/*
 * grunt-autoprefixer
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    var autoprefixer = require('autoprefixer');
    var diff = require('diff');

    grunt.registerMultiTask(
        'autoprefixer',
        'Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website.',
        function() {
            var options = this.options({
                diff: false,
                map: false
            });

            /**
             * @type {Autoprefixer}
             */
            var processor = autoprefixer(options.browsers);

            // Iterate over all specified file groups.
            this.files.forEach(function(f) {

                /**
                 * @type {string[]}
                 */
                var sources = f.src.filter(function(filepath) {

                    // Warn on and remove invalid source files (if nonull was set).
                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else {
                        return true;
                    }
                });

                function process(original, from, to) {
                    var result;

                    if (options.map) {
                        var mapPath = (options.map === true) ? from + '.map' : options.map;

                        result = processor.process(original, {
                            map: (grunt.file.exists(mapPath)) ? grunt.file.read(mapPath) : true,
                            from: from,
                            to: to
                        });

                        grunt.file.write(to + '.map', result.map);
                    } else {
                        result = processor.process(original);
                    }

                    grunt.file.write(to, result.css);

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : to + '.patch';
                        grunt.file.write(diffPath, diff.createPatch(to, original, result.css));
                    }
                }

                sources.forEach(function(filepath) {
                    var dest = f.dest || filepath;

                    process(grunt.file.read(filepath), filepath, dest);
                    grunt.log.writeln('File "' + dest + '" prefixed.');
                });
            });
        }
    );
};
