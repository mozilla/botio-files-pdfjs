var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo('>> Linting');
if (exec('node make lint', {silent:false}).code !== 0) {
  botio.message('+ **Lint:** FAILED');
  fail = true; // non-fatal, continue
} else {
  botio.message('+ **Lint:** Passed');
}

//
// Get PDFs from local cache
//
echo('>> Copying cached PDF files to repo');
cp(__dirname+'/pdf-cache/*', './test/pdfs');

//
// Get ref snapshots
//
echo('>> Getting ref snapshots');
mkdir('-p', './test/ref');
cp('-Rf', __dirname+'/refs/*', './test/ref');

//
// Run tests
//
echo('>> Running tests');

cd('test');
var output = exec('python -u test.py \
                   --browserManifestFile='+__dirname+'/test-files/browser_manifest.json',
                   {silent:false}).output,
    failMatch = output.match(/TEST-UNEXPECTED-FAIL/g);
cd('..');

if (failMatch) {
  botio.message('+ **Regression tests:** FAILED ('+failMatch.length+' tests)');
  fail = true; // non-fatal, continue
} else {
  botio.message('+ **Regression tests:** Passed');
}

//
// Update local cache of PDF files
//
echo('>> Updating local PDF cache')
mkdir('-p', __dirname+'/pdf-cache');
cp('./test/pdfs/*.pdf', __dirname+'/pdf-cache');


if (fail)
  exit(1);
