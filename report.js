const program = require('commander');
const fs = require('fs');
const path = require('path');

let reportsPath = path.normalize(path.join(__dirname, 'reports'));

program
  .version(require('./package.json').version)
  .option('-r --report [string]', 'Report to generate')
  .on('--help', () => {
    let files = fs.readdirSync(reportsPath);
    if (files.length == 0) {
      console.log('There are no reports to run');
      return;
    }
    console.log('Reports: ');
    files.forEach((file) => {
      console.log(
          `    ${ file.replace('.js', '') } : ${ 
            require(path.join(reportsPath, file)).info
          }`
        );
    });
  })
  .parse(process.argv);

//Sanity Checks
if (!program.report) {
  console.warn(
      'Must include a report to generate. Use --help to see usage options'
    );
  process.exit(1);
}

//Generate the selected report
require('./storage')((Models) => {
  console.log(
      `Report written to:\n ${ 
        require(path.join(reportsPath, program.report)).gen(Models)
      }`
    );
});
