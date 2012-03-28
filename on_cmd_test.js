var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo();
echo('>> Linting');

// Using {async} to avoid unnecessary CPU usage
exec('node make lint', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match('files checked, no errors found');

  if (successMatch) {
    botio.message('+ **Lint:** Passed');
  } else {
    botio.message('+ **Lint:** FAILED');
    fail = true; // non-fatal, continue
  }

  //
  // Get PDFs from local cache
  //
  echo();
  echo('>> Deploying cached PDF files');
  cp(__dirname+'/pdf-cache/*', './test/pdfs');

  //
  // Get ref snapshots
  //
  echo();
  echo('>> Getting ref snapshots');
  mkdir('-p', './test/ref');
  cp('-Rf', __dirname+'/refs/*', './test/ref');

  //
  // Deploy custom files
  //
  echo();
  echo('>> Deploying custom files');
  cp('-f', __dirname+'/test-files/browser_manifest.json', './test/resources/browser_manifests');

  //
  // Run tests
  //
  echo();
  echo('>> Running tests');

  // Using {async} to avoid unnecessary CPU usage
  exec('node make test', {silent:false, async:true}, function(error, output) {
    var successMatch = output.match(/All tests passed/g);

    if (successMatch) {
      botio.message('+ **Regression tests:** Passed');
    } else {
      botio.message('+ **Regression tests:** FAILED');
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
  }); // exec test
}); // exec lint
