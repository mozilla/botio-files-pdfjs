var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:true}, function() {

silent(true);

(function runTesting() {
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
  exec('gulp botxfatest', {silent:false, async:true}, function(error, output) {
    var integrationSuccessMatch = output.match(/All integration tests passed/g);
    var unitSuccessMatch = output.match(/All unit tests passed/g);
    var regSuccessMatch = output.match(/All regression tests passed/g);

    if (unitSuccessMatch) {
      botio.message('+ **Unit tests:** Passed');
    } else {
      botio.message('+ **Unit tests:** FAILED');
      fail = true; // non-fatal, continue
    }
    if (integrationSuccessMatch) {
      botio.message('+ **Integration Tests:** Passed');
    } else {
      botio.message('+ **Integration Tests:** FAILED');
      fail = true; // non-fatal, continue
    }
    if (regSuccessMatch) {
      botio.message('+ **Regression tests:** Passed');
    } else {
      botio.message('+ **Regression tests:** FAILED');
      fail = true; // non-fatal, continue

      // Include a detailed summary of the ref-test failures.
      if (output.match(/OHNOES!  Some tests failed!/g)) {
        const details = [];

        const numErrors = output.match(/  errors: \d+/g);
        if (numErrors) {
          details.push(numErrors[0]);
        }
        const numEqFailures = output.match(/  different ref\/snapshot: \d+/g);
        if (numEqFailures) {
          details.push(numEqFailures[0]);
        }
        const numFBFFailures = output.match(/  different first\/second rendering: \d+/g);
        if (numFBFFailures) {
          details.push(numFBFFailures[0]);
        }

        if (details.length > 0) {
          botio.message();
          botio.message("```");
          for (const line of details) {
            botio.message(line);
          }
          botio.message("```");
        }
      }

      //
      // Copy reftest analyzer files
      //
      echo();
      echo('>> Copying reftest analyzer files');
      mv('-f', './test/eq.log', botio.public_dir);
      mv('-f', './test/resources/reftest-analyzer.html', botio.public_dir);
      mv('-f', './test/resources/reftest-analyzer.css', botio.public_dir);
      mv('-f', './test/resources/reftest-analyzer.js', botio.public_dir);
      mv('-f', './test/test_snapshots', botio.public_dir + '/');

      botio.message();
      botio.message('Image differences available at: '+botio.public_url+'/reftest-analyzer.html#web=eq.log');
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
})(); // runTesting

}); // npm install
