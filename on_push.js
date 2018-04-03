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

// uber test

//
// Publish viewer to gh-pages
//
exec('gulp web', {async:true}, function() {

// This dir should have its own .git/
cd('build/gh-pages'); 
exec('git commit --amend --no-edit');
exec('git push --force origin gh-pages');
cd('../..');

//
// Publish library to pdfjs-dist
//
exec('gulp dist', {async:true}, function() {

cd('build/dist');
exec('git push --tags git@github.com:mozilla/pdfjs-dist.git master');
exec('npm publish');
cd('../..');

}); // gulp dist
}); // gulp web
}); // npm install
