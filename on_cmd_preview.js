var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');
exec('npm install');

echo();
echo('>> Making web site');
exec('node make web');

echo();
echo('>> Moving files');
mv('-f', 'build/gh-pages/*', botio.public_dir);

botio.message('#### Published');
botio.message();
botio.message('+ Viewer: '+botio.public_url+'/web/viewer.html');
botio.message('+ B2G Viewer: '+botio.public_url+'/extensions/b2g/content/web/viewer.html');
botio.message('+ Extension: '+botio.public_url+'/extensions/firefox/pdf.js.xpi');
