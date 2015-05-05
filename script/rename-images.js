var fs = require('fs'),
    async = require('async'),
    rootDir = 'img/LETTERS/',
    outputDataFile = 'js/letter-images.js',
    letters = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    countPerLetter = {};

async.eachSeries(letters, function(letter, fn) {
  var dir = rootDir + letter;

  fs.readdir(dir, function(err, files) {
    if (err || !files || !files.length) { return console.log("error with " + dir); }

    var counter = 0,
        tmpDir = dir + '/tmp';

    try {
      fs.mkdirSync(tmpDir);
    } catch(e) {}

    async.eachSeries(files, function(file, fnn) {
      if (file.match(/\.jpg/)) {
        var from = dir + '/' + file,
            to = dir + '/tmp/' + counter + '.jpg';

        fs.rename(from, to, function(err, ok) {
          if (err) { throw err; }
          counter++;
          fnn();
        });
      } else {
        fnn();
      }
    }, function(err) {
      if (err) { throw err; }

      countPerLetter[letter] = counter;

      fs.readdir(tmpDir, function(err, tmpFiles) {
        if (err) { throw err; }

        async.each(tmpFiles, function(tmpFile, fnnn) {
          fs.rename(tmpDir + '/' + tmpFile, dir + '/' + tmpFile, fnnn);
        },fn);
      });
    });
  });
}, function(err, ok) {
  if (err) { throw err; }

  // write the countPerLetter to a js file that can be loaded
  // in the browser:
  fs.writeFile(outputDataFile, 'LetterImages = ' + JSON.stringify(countPerLetter) + ';');

  console.log("Done");
});
