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
// Font Tests
//
echo();
echo('>> Font Tests');

exec('node make fonttest', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match(/All font tests passed/g);

  if (successMatch) {
    botio.message('+ **Font Tests:** Passed');
  } else {
    botio.message('+ **Font Tests:** FAILED');
    fail = true; // non-fatal, continue
  }

  if (fail)
    exit(1);
}); // exec font tests
