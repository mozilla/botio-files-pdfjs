var botio = require(process.env['BOTIO_MODULE']);
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

// This dir should have its own .git/
cd('build/gh-pages'); 
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
