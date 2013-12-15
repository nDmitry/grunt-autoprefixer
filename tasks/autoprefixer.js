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
                diff: false
            });

            /**
             * @type {Autoprefixer}
             */
            var compiler = autoprefixer(options.browsers);

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

                function write(path, original, prefixed) {
                    grunt.file.write(path, prefixed);

                    if (options.diff) {
                        var diffPath = (typeof options.diff === 'string') ? options.diff : path + '.patch';
                        grunt.file.write(diffPath, diff.createPatch(path, original, prefixed));
                    }
                }

                // Write the destination file, or source file if destination isn't specified.
                if (typeof f.dest !== 'undefined') {

                    // Concat specified files.
                    var original = sources.map(function(filepath) {
                        return grunt.file.read(filepath);
                    }).join(grunt.util.linefeed);

                    write(f.dest, original, compiler.compile(original));
                    grunt.log.writeln('Prefixed file "' + f.dest + '" created.');

                } else {

                    sources.forEach(function(filepath) {
                        var original = grunt.file.read(filepath);

                        write(filepath, original, compiler.compile(original));
                        grunt.log.writeln('File "' + filepath + '" prefixed.');
                    });
                }

            });
        }
    );
};
