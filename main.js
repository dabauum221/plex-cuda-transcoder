var chokidar = require('chokidar');
var fs = require("fs");
var sleep = require('sleep');

var folder_watcher = chokidar.watch('/home/user/watch', {ignored: /[\/\\]\./, persistent: true});

folder_watcher
  .on('add', function(path) {
      console.log('File', path, 'has been added');
      var fileSizeInBytes;
      do {
          fileSizeInBytes = fs.statSync(path)["size"];
          console.log('Still copying');
          sleep.sleep(1);
      } while(fs.statSync(path)["size"] !== fileSizeInBytes);
      console.log('Done copying', path);
      
  });