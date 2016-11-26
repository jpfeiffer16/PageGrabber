const fs = require('fs');
const path = require('path');
const FILEPATH = path.normalize(path.join(__dirname, `../httpoccurences.csv`));

module.exports = {
  info: 'Generate a report that tracks the number of non-secure links and their line numbers',
  gen: (Models) => {
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
      results.forEach((result) => {
        csvStream.write(`${ result.url },`);
        if (!result.html) return;
        let lines = result.html.match(/[^\r\n]+/g);
        let matchesFromTop = [];
        let matchesFromBottom = [];
        for (let i  = 0; i < lines.length; i++) {
          let line = lines[i];
          let httpMatches = line.match(/http/g);
          if (!httpMatches) continue;
          httpMatches.forEach((match) => { 
            matchesFromTop.push(i + 1);
            matchesFromBottom.push(((lines.length - 1) - i) + 1);
          });
        }
        csvStream.write(
            `\nFromTop,${ matchesFromTop.join(',') }\nFromBottom,${ matchesFromBottom.join(',') }\n`
          );
      });
      csvStream.end();
    });
    return FILEPATH;
  }
}
