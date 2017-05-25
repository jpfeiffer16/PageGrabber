const fs = require('fs');
const path = require('path');
const FILEPATH = path.normalize(path.join(__dirname, `../occurs.csv`));

module.exports = {
  info: 'List out each page and whether or not it contains the input string',
  gen: (Models, input) => {
    let { Result } = Models;
    let csvStream = fs.createWriteStream(FILEPATH);

    Result.findAll().then((dbresults) => {
      let results = dbresults.map((dbresult) => {
        let result = dbresult.toJSON();
        return result;
      });
      results.forEach((result) => {
        let wordMatches = result.html.match(new RegExp(input, 'g'));
        
        if (!wordMatches) {
          csvStream.write(`"!", "${ result.url }"\n`);
        } else if (wordMatches.length == 1) {
          csvStream.write(`"+", "${ result.url }"\n`);
        } else {
          csvStream.write(`">", "${ result.url }"\n`);
        }
      });
      csvStream.end();
    });
    return FILEPATH;
  }
}