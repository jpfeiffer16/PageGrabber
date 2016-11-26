# PageGrabber
An anylytics and report generation engine for site audits

## Report API
Reports are stored in the `reports/` folder and should expose an 
`info` property that gives info about the report and a `gen` method 
that will be called to generate the report and is expected to return
 the filepath of the report.

 ```javascript
const fs = require('fs');
const path = require('path');
const filepath = path.normalize('./data.csv');

module.exports =  {
  info: 'An example report. In JS!',
  gen: function(Models) {
    //All sequelize models contained in the sqlite 
    //DB are in the Models object
    let stream = fs.createWriteStream(filepath);
    Models.Result.findAll().then((dbresults) => {
      //Dump whatever data you need here
      stream.write(dbresults.map((dbresult) => {
        return dbresult.toJSON().url;
      }).join(',') + '\n');
      stream.end();
    });
    
    return filepath;
  }
};
 ```