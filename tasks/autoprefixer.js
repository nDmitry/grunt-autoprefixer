/*
 * grunt-autoprefixer
 * 
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var autoprefixer = require('autoprefixer');

    grunt.registerMultiTask('autoprefixer', 'Parse CSS and add prefixed properties and values by Can I Use database for actual browsers.', function () {

        var options = this.options(),
            compiler = autoprefixer(options.browsers);

        // Iterate over all specified file groups.
        this.files.forEach(function (f) {

            // Concat specified files.
            var src = f.src.filter(function (filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }

            }).map(function (filepath) {

                    // Read file source.
                    return grunt.file.read(filepath);
                }
            ).join('');

            // Write the destination file.
            grunt.file.write(f.dest, compiler.compile(src));

            // Print a success message.
            grunt.log.writeln('File "' + f.dest + '" created.');
        });
    });

};
