'use strict';

var paths = require('./paths');
try {
  var request = paths.request.get();
  if (['http', 'https'].indexOf(request.protocol) === -1) {
    throw new Error('Invalid protocol ' + request.protocol);
  }
  var http = require(request.protocol === 'http' ? 'http' : 'https');
  delete request.protocol;
  var connectTimeout, timeout;
  var req = http.request(request, function (response) {
    try {
      clearTimeout(connectTimeout);
      var ret = {body: '', statusCode: response.statusCode, headers: response.headers};
      response.setEncoding('utf8');
      response.on('data', function (data) {
        ret.body += data;
      });
      response.on('end', function () {
        clearTimeout(timeout);
        paths.response.set(ret);
      });
    } catch (ex) {
      handle(ex);
    }
  });
  req.on('error', handle);
  req.end();
  if (request['_connect_timeout']) {
    connectTimeout = setTimeout(function () {
      paths.response.set({timedout: true});
      process.exit(0);
    }, request['_connect_timeout'].msec);
  }
  if (request['_timeout']) {
    timeout = setTimeout(function () {
      paths.response.set({timedout: true});
      process.exit(0);
    }, request['_timeout'].msec);
  }
} catch (ex) {
  handle(ex);
}
function handle(ex) {
  paths.error.set(ex.stack || ex + '');
  throw ex;
}