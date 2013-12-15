/*
 * grunt-autoprefixer
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        clean: {
            tests: ['tmp'],
        },

        copy: {
            single_no_dest: {
                src: 'test/fixtures/gradient.css',
                dest: 'tmp/no_dest.css'
            },
            multiple_no_dest: {
                expand: true,
                flatten: true,
                src: 'test/fixtures/*.css',
                dest: 'tmp/multiple_no_dest/'
            }
        },

        autoprefixer: {
            options: {
                // We need to `freeze` browsers versions for testing purposes.
                browsers: ['opera 12', 'ff 15', 'chrome 25']
            },
            single_file: {
                src: 'test/fixtures/gradient.css',
                dest: 'tmp/single_file.css'
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'test/fixtures/*.css',
                dest: 'tmp/multiple_files/'
            },
            concat: {
                src: 'test/fixtures/*.css',
                dest: 'tmp/concat.css'
            },
            single_no_dest: {
                src: 'tmp/no_dest.css'
            },
            multiple_no_dest: {
                src: 'tmp/multiple_no_dest/*.css'
            },
            diff: {
                options: {
                    diff: true
                },
                src: 'test/fixtures/gradient.css',
                dest: 'tmp/diff.css'
            },
            diff_path: {
                options: {
                    diff: 'tmp/diff_path.css.patch'
                },
                src: 'test/fixtures/gradient.css',
                dest: 'tmp/diff_path.css'
            }
        },

        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['clean', 'copy', 'autoprefixer', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
