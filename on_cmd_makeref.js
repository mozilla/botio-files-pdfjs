var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

exec('npm install', {async:true}, function() {
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
  // Make refs
  //
  echo();
  echo('>> Making references');

  // Using {async} to avoid unnecessary CPU usage
  exec('gulp botmakeref', {silent:false, async:true}, function(error, output) {
    var successMatch = output.match(/All regression tests passed/g);

    if (successMatch) {
      botio.message('+ **Make references:** Passed');
    } else {
      botio.message('+ **Make references:** FAILED');
      exit(1); // fatal, no point in continuing
    }

    //
    // Sanity check
    //
    if (test('-d', './test/tmp')) {
      botio.message('+ **Check references:** Passed');
    } else {
      botio.message('+ **Check references:** FAILED (no refs found)');
      exit(1); // fatal, no point in continuing
    }

    //
    // Push up-to-date reference snapshots
    //
    echo();
    echo('>> Updating ref snapshots');
    mkdir('-p', __dirname+'/refs');
    cp('-Rf', './test/tmp/*', __dirname+'/refs');

    //
    // Update local cache of PDF files
    //
    echo();
    echo('>> Updating local PDF cache')
    mkdir('-p', __dirname+'/pdf-cache');
    cp('./test/pdfs/*.pdf', __dirname+'/pdf-cache');
  }); // exec makeref
}); // npm install
