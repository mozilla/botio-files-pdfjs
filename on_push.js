var botio = require(process.env['BOTIO_MODULE']);
require('shelljs/global');

exec('npm install', {async:false});

// uber test

//
// Publish viewer to gh-pages
//
exec('node make web'); 

// This dir should have its own .git/
cd('build/gh-pages'); 
exec('git push --force origin gh-pages');
