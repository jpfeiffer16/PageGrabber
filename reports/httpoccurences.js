const fs = require('fs');

module.exports = {
  info: 'Generate a report that tracks the number and line numbers of non-secure links',
  gen: (Models) => {
    //Pull out Models
    let { Result } = Models;

    //Create the stream for the report file.
    let csvStream = fs.createWriteStream('./httpoccurences.csv');
    // csvStream.write('url,');


    //Find all Results and start dumping them to the csv file
    Result.findAll().then((dbresults) => {
      let results = dbresults.map((dbresult) => {
        let result = dbresult.toJSON();
        // console.log(JSON.stringify(result));
        return result;
      });
      results.forEach((result) => {
        csvStream.write(`${ result.url }`);
        let httpMatches = result.html.match(/http/g);
        httpMatches.forEach((match) => { 
          //TODO: Log line number here
        });
        csvStream.write('\n');
      });
      csvStream.end();
    });
  }
}
