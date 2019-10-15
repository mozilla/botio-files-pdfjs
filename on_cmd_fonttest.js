var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:false});
exec('git submodule init', {async:false});
exec('git submodule update', {async:false});

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

exec('gulp fonttest', {silent:false, async:true}, function(error, output) {
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
