var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

var fail = false;

exec('npm install', {async:false});
exec('git submodule init', {async:false});
exec('git submodule update', {async:false});

silent(true);

//
// Lint
//
echo();
echo('>> Linting');

exec('gulp lint', {silent:false, async:true}, function(error, output) {
  var successMatch = output.match('files checked, no errors found');

  if (successMatch) {
    botio.message('+ **Lint:** Passed');
  } else {
    botio.message('+ **Lint:** FAILED');
    fail = true; // non-fatal, continue
  }

  if (fail)
    exit(1);
}); // exec lint
