#!/usr/bin/node
const program = require('commander'),
      fs = require('fs'),
      path = require('path');

let reportsPath = path.normalize(path.join(__dirname, 'reports'));

program
  .version(require('./package.json').version)
  .option('-r --report [string]', 'Report to generate')
  .option('-i --input [string]', 'Input to pass to the report')
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
let report = null;
try {
  report = require(path.join(reportsPath, program.report));
} catch (err) {
  console.warn(`Cannot find report ${ program.report }`);
  process.exit(1);
}
require('./storage')((Models) => {
  console.log(
      `Report written to:\n ${ 
        report.gen(Models, program.input)
      }`
    );
});
