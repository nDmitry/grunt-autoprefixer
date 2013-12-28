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
        var expected = grunt.file.read('test/expected/single_file.css');

        test.strictEqual(actual, expected, 'should prefix single file.');
        test.done();
    },

    multiple_files: function(test) {
        var actual = grunt.file.read('tmp/multiple_files/cube.css') +
                     grunt.file.read('tmp/multiple_files/gradient.css');
        var expected = grunt.file.read('test/expected/multiple_files/cube.css') +
                       grunt.file.read('test/expected/multiple_files/gradient.css');

        test.strictEqual(actual, expected, 'should prefix all files.');
        test.done();
    },

    single_no_dest: function(test) {
        var actual = grunt.file.read('tmp/no_dest.css');
        var expected = grunt.file.read('test/expected/no_dest.css');

        test.strictEqual(actual, expected, 'should prefix a source file if target have no destination specified.');
        test.done();
    },

    multiple_no_dest: function(test) {
        var actual = grunt.file.read('tmp/multiple_no_dest/cube.css') +
                     grunt.file.read('tmp/multiple_no_dest/gradient.css');
        var expected = grunt.file.read('test/expected/multiple_no_dest/cube.css') +
                       grunt.file.read('test/expected/multiple_no_dest/gradient.css');

        test.strictEqual(actual, expected, 'should prefix all source files if target have no destination specified.');
        test.done();
    },

    diff: function(test) {
        var actual = grunt.file.read('tmp/diff.css') +
                     grunt.file.read('tmp/diff.css.patch');
        var expected = grunt.file.read('test/expected/diff.css') +
                       grunt.file.read('test/expected/diff.css.patch');

        test.strictEqual(actual, expected, 'should create patch diff for prefixed file.');
        test.done();
    },

    diff_path: function(test) {
        var actual = grunt.file.read('tmp/diff_path.css') +
                     grunt.file.read('tmp/diff_path.css.patch');
        var expected = grunt.file.read('test/expected/diff_path.css') +
                       grunt.file.read('test/expected/diff_path.css.patch');

        test.strictEqual(actual, expected, 'should create patch diff for prefixed file and save it to custom path.');
        test.done();
    },

    sm: function(test) {
        var actual = grunt.file.read('tmp/sm.css') +
                     grunt.file.read('tmp/sm.css.map');
        var expected = grunt.file.read('test/expected/sm.css') +
                       grunt.file.read('test/expected/sm.css.map');

        test.strictEqual(actual, expected, 'should generate new sourcemap.');
        test.done();
    },

    sm_update: function(test) {
        var actual = grunt.file.read('tmp/sm_update.css') +
                     grunt.file.read('tmp/sm_update.css.map');
        var expected = grunt.file.read('test/expected/sm_update.css') +
                       grunt.file.read('test/expected/sm_update.css.map');

        test.strictEqual(actual, expected, 'should take sourcemap at specified path and update it.');
        test.done();
    },

    sm_update_by_path: function(test) {
        var actual = grunt.file.read('tmp/sm_update_by_path.css') +
                     grunt.file.read('tmp/sm_update_by_path.css.map');
        var expected = grunt.file.read('test/expected/sm_update_by_path.css') +
                       grunt.file.read('test/expected/sm_update_by_path.css.map');

        test.strictEqual(actual, expected, 'should take sourcemap at specified path and update it.');
        test.done();
    },

    sm_wo_file: function(test) {
        var actual = grunt.file.read('tmp/sm_wo_file.css') +
                     grunt.file.read('tmp/sm_wo_file.css.map');
        var expected = grunt.file.read('test/expected/sm_wo_file.css') +
                       grunt.file.read('test/expected/sm_wo_file.css.map');

        test.strictEqual(actual, expected, 'should add the file property to an updated source map.');
        test.done();
    },

    sm_new_name: function(test) {
        var actual = grunt.file.read('tmp/sm_new_name.css') +
                     grunt.file.read('tmp/sm_new_name.css.map');
        var expected = grunt.file.read('test/expected/sm_new_name.css') +
                       grunt.file.read('test/expected/sm_new_name.css.map');

        test.strictEqual(actual, expected, 'should update annotation when file name is changed.');
        test.done();
    }

};
