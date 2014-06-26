'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.autoprefixer = {

    setUp: function(done) {
        // setup here if necessary
        done();
    },

    single_file: function(test) {
        var actual = grunt.file.read('tmp/single_file.css');
        var expected = grunt.file.read('test/expected/gradient.css');

        test.strictEqual(actual, expected, 'should prefix single file.');
        test.done();
    },

    multiple_files: function(test) {
        var actual = grunt.file.read('tmp/multiple_files/gradient.css');
        var expected = grunt.file.read('test/expected/gradient.css');

        test.strictEqual(actual, expected, 'should prefix all files.');
        test.done();
    },

    single_no_dest: function(test) {
        var actual = grunt.file.read('tmp/no_dest.css');
        var expected = grunt.file.read('test/expected/gradient.css');

        test.strictEqual(actual, expected, 'should prefix a source file if target have no destination specified.');
        test.done();
    },

    no_dest_multiple: function(test) {
        var actual = grunt.file.read('tmp/no_dest_multiple/gradient.css');
        var expected = grunt.file.read('test/expected/gradient.css');

        test.strictEqual(actual, expected, 'should prefix all source files if target have no destination specified.');
        test.done();
    },

    diff: function(test) {
        var actual = grunt.file.read('tmp/diff.css') +
                     grunt.file.read('tmp/diff.css.patch');
        var expected = grunt.file.read('test/expected/gradient.css') +
                       grunt.file.read('test/expected/diff.css.patch');

        test.strictEqual(actual, expected, 'should create patch diff for prefixed file.');
        test.done();
    },

    diff_path: function(test) {
        var actual = grunt.file.read('tmp/diff_path.css') +
                     grunt.file.read('tmp/diff_path.css.patch');
        var expected = grunt.file.read('test/expected/gradient.css') +
                       grunt.file.read('test/expected/diff_path.css.patch');

        test.strictEqual(actual, expected, 'should create patch diff for prefixed file and save it to custom path.');
        test.done();
    },

    sm: function(test) {
        var actual = grunt.file.read('tmp/sm.css') +
                     grunt.file.read('tmp/sm.css.map');
        var expected = grunt.file.read('test/expected/sm.css') +
                       grunt.file.read('test/expected/sm.css.map');

        test.strictEqual(actual, expected, 'should generate new source map.');
        test.done();
    },

    sm_update: function(test) {
        var actual = grunt.file.read('tmp/sm_update.css') +
                     grunt.file.read('tmp/sm_update.css.map');
        var expected = grunt.file.read('test/expected/sm_update.css') +
                       grunt.file.read('test/expected/sm_update.css.map');

        test.strictEqual(actual, expected, 'should find previous source map and update it if it exists.');
        test.done();
    },

    sm_update_by_path: function(test) {
        var actual = grunt.file.read('tmp/sm_update_by_path.css') +
                     grunt.file.read('tmp/sm_update_by_path.css.map');
        var expected = grunt.file.read('test/expected/sm_update_by_path.css') +
                       grunt.file.read('test/expected/sm_update_by_path.css.map');

        test.strictEqual(actual, expected, 'should take source map at specified path and update it.');
        test.done();
    },

    sm_void: function(test) {
        var actual = grunt.file.read('tmp/sm_void.css');
        var expected = grunt.file.read('test/expected/sm_void.css');

        test.strictEqual(actual, expected, 'shouldn\'t generate a map if map option is `false`.');
        test.ok(grunt.file.exists('tmp/sm_void.css.map') === false);
        test.done();
    },

    sm_inline: function(test) {
        var actual = grunt.file.read('tmp/sm_inline.css');
        var expected = grunt.file.read('test/expected/sm_inline.css');

        test.strictEqual(actual, expected, 'should inline new source map.');
        test.done();
    },

    sm_inline_update: function(test) {
        var actual = grunt.file.read('tmp/sm_inline_update.css');
        var expected = grunt.file.read('test/expected/sm_inline_update.css');

        test.strictEqual(actual, expected, 'should update inlined source map.');
        test.done();
    },

    sm_inline_update_by_path: function(test) {
        var actual = grunt.file.read('tmp/sm_inline_update_by_path.css');
        var expected = grunt.file.read('test/expected/sm_inline_update_by_path.css');

        test.strictEqual(actual, expected, 'should take source map at specified path, update and inline it.');
        test.done();
    },

    sm_inline_void: function(test) {
        var actual = grunt.file.read('tmp/sm_inline_void.css');
        var expected = grunt.file.read('test/expected/sm_inline_void.css');

        test.strictEqual(actual, expected, 'shouldn\'t inline a map if map option is `false`.');
        test.done();
    },

};
