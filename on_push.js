var botio = require(process.env['BOTIO_MODULE']);
var path = require('path');
require('shelljs/global');

try {
  var jobInfo = JSON.parse(process.env['BOTIO_JOBINFO']);
  var reason = 'See mozilla/pdf.js@' + jobInfo.head_sha;
  process.env['PDFJS_UPDATE_REASON'] = reason;
  echo('>> Setting reason to: ' + reason);
} catch (_) {}

exec('npm install', {async:false});

// uber test

//
// Publish viewer to gh-pages
//
exec('node make web');
//
// Sign the extension
//
exec('node ' + path.join(__dirname, 'signxpi.js') + ' ./build/gh-pages/extensions/firefox/pdf.js.xpi');

// This dir should have its own .git/
cd('build/gh-pages'); 
exec('git add extensions/firefox/pdf.js.xpi');
exec('git commit --amend --no-edit');
exec('git push --force origin gh-pages');
cd('../..');

//
// Publish library to pdfjs-dist
//
exec('node make dist');

cd('build/dist');
exec('git push --tags git@github.com:mozilla/pdfjs-dist.git master');
exec('npm publish');
cd('../..');
