var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo();
echo('>> Linting');

exec('node make lint', {silent:false, async:true}, function(error, output) {
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
