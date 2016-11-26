# PageGrabber
An anylytics and report generation engine for site audits.

## Usage

### Getting Data
To query a site based off of a csv file:

`node app -f /path/to/file.csv`

### Querying data and generating reports
To get a commanding listing and info about installed reports:

`$ node report -h`

```
  Usage: report [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -r --report [string]  Report to generate

Reports:
    httpoccurences : Generate a report that tracks the number of non-secure links and their line numbers
```

To use a report:

`$ node report -r httpoccurences`
```
Report written to:
 /path/to/project/httpoccurences.csv
```

Running the tool against a site generates a sqlite db based on the returned
results that can also be queried with a tool for some quick-and-dirty
information.

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