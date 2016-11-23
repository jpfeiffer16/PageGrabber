const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version(require('./package.json').version)
  .option('-r --report [string]', 'Report to generate');
  
program.on('--help', () => {
    console.log('Custom help');
    console.log(path.normalize(path.join(__dirname, 'reports')));
    //TODO: Generate list of reports and their info hre.  
    fs.readdir(path.normalize(path.join(__dirname, 'reports')), (err, files) => {
      console.log(files);
      if (err) throw err;
      files.forEach((file) => {
        // console.log(require(`./repors/${ file }`).info);
      });
    });
  })
  .parse(process.argv);