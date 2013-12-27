/*
 * grunt-autoprefixer
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    var path = require('path');
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

                function fixFile(map, filePath) {
                    map = JSON.parse(map);
                    map.file = path.basename(filePath);

                    return JSON.stringify(map);
                }

                function fixSources(sources, to) {
                    sources.forEach(function(source, index) {

                        // Set the correct path to a source file
                        sources[index] = path.relative(path.dirname(to), source);
                    });

                    return sources;
                }

                function getMapParam(mapPath, from) {

                    if (grunt.file.exists(mapPath)) {
                        return fixFile(grunt.file.read(mapPath), from);
                    } else {
                        return true;
                    }
                }

                function writeDiff(to, original, prefixed) {
                    var diffPath = (typeof options.diff === 'string') ? options.diff : to + '.patch';

                    grunt.file.write(diffPath, diff.createPatch(to, original, prefixed));
                }

                function addAnnotation(result, to) {

                    // PostCSS doesn't add the annotation yet
                    result.css = result.css.concat(
                        grunt.util.linefeed,
                        '/*# sourceMappingURL=' + path.basename(to) + '.map */'
                    );
                }

                function compile(original, from, to) {
                    var result;

                    if (options.map) {
                        var mapPath;

                        if (options.map === true) {
                            mapPath = from + '.map';
                        } else {
                            mapPath = options.map + path.basename(from) + '.map';
                        }

                        // source-map lib works incorrectly if an input file is in subdirectory
                        // so we must cwd to subdirectry and make all paths relative to it
                        // https://github.com/ai/postcss/issues/13
                        process.chdir(path.dirname(from));
                        mapPath = path.relative(path.dirname(from), mapPath);
                        to = path.relative(path.dirname(from), to);
                        from = path.basename(from);

                        result = processor.process(original, {
                            map: getMapParam(mapPath, from),
                            from: from,
                            to: to
                        });

                        var map = JSON.parse(fixFile(result.map, to));

                        if (grunt.file.exists(mapPath)) {
                            map.sources = fixSources(JSON.parse(grunt.file.read(mapPath)).sources, to);
                        } else {
                            fixSources(map.sources, to);
                            addAnnotation(result, to);
                        }

                        grunt.file.write(to + '.map', JSON.stringify(map));
                    } else {
                        result = processor.process(original);
                    }

                    grunt.file.write(to, result.css);

                    options.diff && writeDiff(to, original, result.css);
                }

                sources.forEach(function(filepath) {
                    var dest = f.dest || filepath;
                    var cwd = process.cwd();

                    compile(grunt.file.read(filepath), filepath, dest);

                    // Restore the default cwd
                    process.chdir(cwd);
                    grunt.log.writeln('File "' + dest + '" prefixed.');
                });
            });
        }
    );
};
