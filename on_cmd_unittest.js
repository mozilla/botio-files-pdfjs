var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:false});
exec('git submodule init', {async:false});
exec('git submodule update', {async:false});

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
// Unit Tests
//
echo();
echo('>> Unit Tests');

exec('gulp unittest', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match(/All unit tests passed/g);

  if (successMatch) {
    botio.message('+ **Unit Tests:** Passed');
  } else {
    botio.message('+ **Unit Tests:** FAILED');
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
}); // exec unit tests
