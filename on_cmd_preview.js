var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

echo();
echo('>> Making web site');
exec('node make web');

echo();
echo('>> Moving files');
mv('-f', 'build/gh-pages/*', botio.public_dir);

botio.message('#### Published');
botio.message();
botio.message('+ Viewer: ' + botio.public_url + '/web/viewer.html');
botio.message('+ Firefox Extension: ' + botio.public_url +
  '/extensions/firefox/pdf.js.xpi');
botio.message('+ Firefox Extension (AMO): ' + botio.public_url +
  '/extensions/firefox/pdf.js.amo.xpi');

// Only link to the Chrome extension if it exists
if (find('-f', botio.public_url + '/extensions/chrome/pdf.js.crx')) {
  botio.message('+ Chrome Extension: ' + botio.public_url +
    '/extensions/chrome/pdf.js.crx');
}

