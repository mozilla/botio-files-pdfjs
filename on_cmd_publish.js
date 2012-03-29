var botio = require('botio');
require('shelljs/global');

echo();
echo('>> Making web site');
exec('node make web');

echo();
echo('>> Moving files');
mv('-f', 'build/gh-pages/*', botio.public_dir);

botio.message('#### Published');
botio.message('You can browse the web files at:');
botio.message();
botio.message('+ '+botio.public_url);
