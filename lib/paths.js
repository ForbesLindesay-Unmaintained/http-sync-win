'use strict';

var fs = require('fs');
var normalize = require('path').normalize;
var rimraf = require('rimraf').sync;
var JSONL = require('json-literal');

function p(path) {
  var str = normalize(__dirname + '/temp/' + path + '.js');
  return new Path(str);
}
function Path(p) {
  this.p = p;
}
Path.prototype.get = function () {
  return JSONL.parse(this.read());
}
Path.prototype.set = function (obj) {
  this.write(JSONL.stringify(obj));
}
Path.prototype.read = function () {
  return fs.readFileSync(this.p, 'utf8');
}
Path.prototype.write = function (str) {
  return fs.writeFileSync(this.p, str);
}
Path.prototype.exists = function () {
  return fs.existsSync(this.p);
}

var paths = {
  request: p('request'),
  response: p('response'),
  error: p('error'),
  reset: function () {
    rimraf(__dirname + '/temp');
    fs.mkdirSync(__dirname + '/temp');
  }
}

module.exports = paths;