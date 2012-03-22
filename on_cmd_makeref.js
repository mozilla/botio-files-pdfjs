var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo('>> Linting');
if (exec('make lint', {silent:false}).code !== 0) {
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
// Deploy missing files
//
echo('>> Deploying missing files');
cp('-f', __dirname+'/test-files/local.mk', '.');
cp('-f', __dirname+'/test-files/browser_manifest.json', './test/resources/browser_manifests');

//
// Make refs
//
echo('>> Making references');

var output = exec('make bot_master', {silent:false}).output,
    failMatch = output.match(/TEST-UNEXPECTED-FAIL/g);

if (failMatch) {
  botio.message('+ **Make references:** FAILED ('+failMatch.length+' tests)');
  fail = true; // non-fatal, continue
} else {
  botio.message('+ **Make references:** Passed');
}

//
// Sanity check
//
if (!test('-d', './test/ref')) {
  botio.message('+ **Make references:** FAILED (no refs found)');
  exit(1); // fatal, no point in continuing
}

//
// Copy (possibly) new PDFs to local cache
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
