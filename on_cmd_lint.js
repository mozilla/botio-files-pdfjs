var botio = require('botio');
require('shelljs/global');

var fail = false;

silent(true);

//
// Lint
//
echo('>> Linting');
if (exec('make lint', {silent:false}).code !== 0) {
  botio.message('+ **Lint:** FAILED');
  fail = true; // non-fatal, continue
} else {
  botio.message('+ **Lint:** Passed');
}

if (fail)
  exit(1);
