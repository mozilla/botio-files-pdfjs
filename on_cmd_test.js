var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:true}, function() {
exec('git submodule init', {async:false});
exec('git submodule update', {async:false});

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

  process.env['SKIP_BABEL'] = 'true'; // Disable Babel translation.

  // Using {async} to avoid unnecessary CPU usage
  exec('gulp bottest', {silent:false, async:true}, function(error, output) {
    var unitSuccessMatch = output.match(/All unit tests passed/g);
    var fontSuccessMatch = output.match(/All font tests passed/g);
    var regSuccessMatch = output.match(/All regression tests passed/g);

    if (fontSuccessMatch) {
      botio.message('+ **Font tests:** Passed');
    } else {
      botio.message('+ **Font tests:** FAILED');
      fail = true; // non-fatal, continue
    }
    if (unitSuccessMatch) {
      botio.message('+ **Unit tests:** Passed');
    } else {
      botio.message('+ **Unit tests:** FAILED');
      fail = true; // non-fatal, continue
    }
    if (regSuccessMatch) {
      botio.message('+ **Regression tests:** Passed');
    } else {
      botio.message('+ **Regression tests:** FAILED');
      fail = true; // non-fatal, continue

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
