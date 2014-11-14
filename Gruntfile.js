/*
 * grunt-autoprefixer
 *
 * Copyright (c) 2013 Dmitry Nikitenko
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

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
            no_dest_multiple: {
                expand: true,
                flatten: true,
                src: 'test/fixtures/*.css',
                dest: 'tmp/no_dest_multiple/'
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

            no_dest_single: {
                src: 'tmp/no_dest.css'
            },
            no_dest_multiple: {
                src: 'tmp/no_dest_multiple/*.css'
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
                    diff: 'tmp/diff_path.css.diff'
                },
                src: 'test/fixtures/gradient.css',
                dest: 'tmp/diff_path.css'
            },

            sm: {
                options: {
                    map: {
                        inline: false
                    }
                },
                src: 'test/fixtures/sm.css',
                dest: 'tmp/sm.css'
            },
            sm_update: {
                options: {
                    map: true
                },
                src: 'test/fixtures/sm_update.css',
                dest: 'tmp/sm_update.css'
            },
            sm_update_by_path: {
                options: {
                    map: {
                        inline: false,
                        prev: 'test/fixtures/'
                    }
                },
                src: 'test/fixtures/sm_update.css',
                dest: 'tmp/sm_update_by_path.css'
            },
            sm_void: {
                options: {
                    map: false
                },
                src: 'test/fixtures/sm_update.css',
                dest: 'tmp/sm_void.css'
            },

            sm_inline: {
                options: {
                    map: true
                },
                src: 'test/fixtures/sm.css',
                dest: 'tmp/sm_inline.css'
            },
            sm_inline_update: {
                options: {
                    map: true
                },
                src: 'test/fixtures/sm_inline_update.css',
                dest: 'tmp/sm_inline_update.css'
            },
            log: {
                src: 'tmp/single_file.css',
                dest: 'tmp/single_file.css'
            }
        },

        nodeunit: {
            tests: ['test/test.js'],
        },

    });

    grunt.loadTasks('tasks');

    grunt.registerTask('test', ['clean', 'copy', 'autoprefixer', 'nodeunit']);
    grunt.registerTask('default', ['jshint', 'test']);

};
