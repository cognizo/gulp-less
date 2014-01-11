var less = require('less');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var defaults = require('lodash.defaults');
var es = require('event-stream');

module.exports = function (options) {

  function parseLess (file, callback) {
    var self = this;
    if (file.isNull()) return this.queue(file); // pass along
    if (file.isStream()) return callback(new PluginError('gulp-less', 'Streaming not supported'));

    // set the default options
    var opts = defaults(options || {}, {
      filename: file.path,
      paths: [ path.dirname(file.path) ]
    });

    // let people use their own compressor
    delete opts.compress;

    var str = file.contents.toString('utf8');
    less.render(str, opts, function (err, css) {
      if (err) return callback(new PluginError('gulp-less', err));

      file.contents = new Buffer(css);
      file.path = gutil.replaceExtension(file.path, '.css');

      callback(null, file);
    });
  }

  return es.map(parseLess);
};
