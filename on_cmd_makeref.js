var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo('>> Linting');

var output = exec('node make lint', {silent:false}).output,
    successMatch = output.match('files checked, no errors found');

if (successMatch) {
  botio.message('+ **Lint:** Passed');
} else {
  botio.message('+ **Lint:** FAILED');
  fail = true; // non-fatal, continue
}

//
// Get PDFs from local cache
//
echo('>> Copying cached PDF files to repo');
cp(__dirname+'/pdf-cache/*', './test/pdfs');

//
// Deploy custom files
//
echo('>> Deploying custom files');
cp('-f', __dirname+'/test-files/browser_manifest.json', './test/resources/browser_manifests');

//
// Make refs
//
echo('>> Making references');

var output = exec('node make makeref', {silent:false}).output,
    successMatch = output.match(/All tests passed/g);

if (successMatch) {
  botio.message('+ **Make references:** Passed');
} else {
  botio.message('+ **Make references:** FAILED');
  fail = true; // non-fatal, continue
}

//
// Sanity check
//
if (!test('-d', './test/ref')) {
  botio.message('+ **Check references:** FAILED (no refs found)');
  exit(1); // fatal, no point in continuing
}

//
// Update local cache of PDF files
//
echo('>> Updating local PDF cache')
mkdir('-p', __dirname+'/pdf-cache');
cp('./test/pdfs/*.pdf', __dirname+'/pdf-cache');


//
// Push up-to-date reference snapshots
//
echo('>> Updating ref snapshots');
mkdir('-p', __dirname+'/refs');
cp('-Rf', './test/ref/*', __dirname+'/refs');

if (fail)
  exit(1);
