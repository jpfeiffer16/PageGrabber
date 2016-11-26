//This version uses a sqlite db
//Get module deps
const fs = require('fs'),
    request = require('request'),
    program = require('commander'),
    path = require('path'),
    csv = require('csv-parse'),
    os = require('os'),
    ProgressBar = require('progress');

//CLI setup
program
  .version(require('./package.json').version)
  .option('-f --file [string]', 'File to use')
  .parse(process.argv);

//Sanity checks
if (!program.file) {
    throw 'Must include a file';
}

//Get models and do main logic
require('./storage')((Models)  => {
  let { Result } = Models;
  console.log('Done syncing DB');
  fs.readFile(path.normalize(program.file), 'utf-8', function (err, data) {
    if (err) throw err;
    csv(data, {
      trim: true
    }, function (err, output) {
      if (err) throw err;
      console.log('Done parsing csv');
      let bar = new ProgressBar(':bar', { total: output.length });
      output.forEach(function(data, index) {
        let url = data[0];
        request(url, function (err, response, body) {
          // Create sqlite record here.
          Result.create({
            url: url,
            html: body
          }).then(() => {
            bar.tick();
          });
        });
      });
    })
  });
});
