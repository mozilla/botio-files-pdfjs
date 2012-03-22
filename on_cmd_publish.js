var botio = require('botio');
require('shelljs/global');

// cp('-R', 'web/*', botio.jobInfo.public_dir);

botio.message('#### Published');
botio.message('You can view your repo files at: '+botio.jobInfo.public_url);
