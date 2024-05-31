var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:false});

silent(true);

//
// Get PDFs from local cache
//
echo();
echo('>> Deploying cached PDF files');
cp(__dirname+'/pdf-cache/*', './test/pdfs');

//
// Deploy custom files
//
echo();
echo('>> Deploying custom files');
cp('-f', __dirname+'/test-files/browser_manifest.json', './test/resources/browser_manifests');

//
// Integration Tests
//
echo();
echo('>> Integration Tests');

exec('npx gulp integrationtest', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match(/All integration tests passed/g);

  if (successMatch) {
    botio.message('+ **Integration Tests:** Passed');
  } else {
    botio.message('+ **Integration Tests:** FAILED');
    fail = true; // non-fatal, continue
  }

  //
  // Update local cache of PDF files
  //
  echo();
  echo('>> Updating local PDF cache')
  mkdir('-p', __dirname+'/pdf-cache');
  cp('./test/pdfs/*.pdf', __dirname+'/pdf-cache');

  if (fail)
    exit(1);
}); // exec integration tests
