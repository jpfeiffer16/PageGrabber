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

function complete(errors) {
  if (errors.length > 0) {
    console.log('Finished, with errors:');
    errors.forEach((err) => {
      console.log(`${ err.message }:\t${ err.url }`);
    });
  } else {
    console.log('Finished.');
  }
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
      let bar = new ProgressBar('importing [:bar]', { total: output.length });
      let errors = [];
      output.forEach(function(data, index) {
        let url = data[0];
        request(url, function (err, response, body) {
          // Create sqlite record here.
          if (err) {
            bar.tick();
            err.url = url;
            errors.push(err);
            return;
          }

          if (~response.headers['content-type'].toString().toLowerCase().indexOf('text/html')) {
            Result.create({
              url: url,
              html: body
            }).then(() => {
              bar.tick();
              if (bar.complete) {
                complete(errors);
              }
            });
          } else {
            bar.tick();
            let thisError = {
              message: 'Mimetype not text/html',
              url
            };
            errors.push(thisError);
            if (bar.complete) {
              complete(errors);
            }
          }
        });
      });
    })
  });
});