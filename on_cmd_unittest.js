var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

silent(true);

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

exec('node make unittest', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match(/All unit tests passed/g);

  if (successMatch) {
    botio.message('+ **Unit Tests:** Passed');
  } else {
    botio.message('+ **Unit Tests:** FAILED');
    fail = true; // non-fatal, continue
  }

  if (fail)
    exit(1);
}); // exec unit tests
