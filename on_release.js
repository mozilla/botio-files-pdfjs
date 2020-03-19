var botio = require(process.env['BOTIO_MODULE']);
var path = require('path');
require('shelljs/global');

try {
  var jobInfo = JSON.parse(process.env['BOTIO_JOBINFO']);
  var reason = 'See mozilla/pdf.js@' + jobInfo.head_sha;
  process.env['PDFJS_UPDATE_REASON'] = reason;
  echo('>> Setting reason to: ' + reason);
} catch (_) {}

exec('npm install', {async:true}, function () {

//
// Publish library to pdfjs-dist
//
exec('gulp dist', {async:true}, function() {

cd('build/dist');
if (jobInfo.prerelease) {
  // The release hook doesn't differentiate between making a new release
  // and updating an existing release, so both actions will trigger this
  // bot action. However, we only want to push to `pdfjs-dist` when making
  // a new prerelease, because otherwise updating an existing prerelease
  // to make it stable would push the same commit again.
  exec('git push --tags git@github.com:mozilla/pdfjs-dist.git master');
}
exec('npm publish' + (jobInfo.prerelease ? ' --tag next' : ''));
cd('../..');

}); // gulp dist
}); // npm install
