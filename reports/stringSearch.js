const fs = require('fs');
const path = require('path');
const FILEPATH = path.normalize(path.join(__dirname, `../stringSearch.csv`));

module.exports = {
  info: 'Generate a report that gets all lines containing a certain string. Must pass input with -i.',
  gen: (Models, input) => {
    //Pull out Models
    let { Result } = Models;

    //Create the stream for the report file.
    let csvStream = fs.createWriteStream(FILEPATH);

    //Find all Results and start dumping them to the csv file
    Result.findAll().then((dbresults) => {
      let results = dbresults.map((dbresult) => {
        let result = dbresult.toJSON();
        return result;
      });
      var globalMatches = [];
      results.forEach((result) => {
        var matches = [];
        // csvStream.write(`${ result.url },`);
        if (!result.html) return;
        let lines = result.html.match(/[^\r\n]+/g);
        for (let i  = 0; i < lines.length; i++) {
          let line = lines[i];
          let wordMatches = line.match(new RegExp('^.*' + input + '.*$', 'g'));
          if (!wordMatches) continue;
          wordMatches.forEach((match) => {
            matches.push(match);
            globalMatches.push();
          });
        }
        matches.forEach((match) => {
          csvStream.write(
            `"${ result.url }","${ match }"\n`
          );
        });

      });
      csvStream.end();
      console.log();
    });
    return FILEPATH;
  }
}
