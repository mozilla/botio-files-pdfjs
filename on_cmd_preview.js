var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');
exec('npm install');

echo();
echo('>> Making web site');
exec('gulp web');

echo();
echo('>> Moving files');
mv('-f', 'build/gh-pages/*', botio.public_dir);

botio.message('#### Published');
botio.message();
botio.message('+ Viewer: '+botio.public_url+'/web/viewer.html');
