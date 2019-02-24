var chokidar = require('chokidar');
var fs = require("fs");
var child_process = require('child_process');
var sleep = require('sleep');
var path = require('path');

var spawn = child_process.spawn;
var folder_watcher = chokidar.watch('/watch', {
  ignored: /[\/\\]\./,
  persistent: true
});

folder_watcher
  .on('add', function(file) {
      if (file.endsWith('.ts')) {
        console.log('File', file, 'has been added');
        var fileSizeInBytes;
        do {
          fileSizeInBytes = fs.statSync(file)["size"];
          console.log(file, 'is still being written, waiting 10 seconds...');
          sleep.sleep(10);
        } while(fs.statSync(file)["size"] !== fileSizeInBytes);
        console.log('Done writing', file + '.', 'Start enciding to MKV...');
        transcode(file, path.dirname(file) + '/' + path.basename(file, '.ts') + '.mkv');
      }
  })
  .on('error', function(file) {
    console.log('Watch error for', file);
  });

function transcode(source, dest) {
  var args = ['./scripts/ffmpeg.sh', source, dest];
  var ffmpeg = spawn('sh', args);
  console.log('Spawning sh ' + args.join(' '));
  ffmpeg.on('exit', function (code, signal) {
    console.log('ffmpeg exited with code ' + code + ' and signal ' + signal);
    if (code === 0) {
      spawn('sh', ['./scripts/post-transcode.sh', source]);
    }
  });
  ffmpeg.stderr.on('data', function (data) {
    console.log('grep stderr: ' + data);
  });
}