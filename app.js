var fs = require('fs'),
    request = require('request'),
    program = require('commander'),
    path = require('path'),
    csv = require('csv-parse'),
    os = require('os'),
    ProgressBar = require('progress');

var dirToUse = path.join(os.homedir(), 'pageget');

var files = fs.readdirSync(dirToUse);

files.forEach(function (file) {
    fs.unlinkSync(path.join(dirToUse, file));
});

fs.rmdirSync(dirToUse);

fs.mkdirSync(dirToUse);




program
    .version(require('./package.json').version)
    .option('-f --file [string]', 'File to use')
    .parse(process.argv);

if (!program.file) {
    throw 'Must include a file';
}


fs.readFile(program.file, 'utf-8', function (err, data) {
    if (err) throw err;
    csv(data, {
        trim: true
    }, function (err, output) {
        if (err) throw err;

        console.log('Done parsing csv');
        var bar = new ProgressBar(':bar', { total: output.length });
        output.forEach(function(data, index) {
            var url = data[0];
            request(url).pipe(fs.createWriteStream(path.join(dirToUse, index + '.html'))).on('finish', function () {
                // console.log(url);
                bar.tick();
            });
        });
    })
});



