var chokidar = require('chokidar');
var fs = require("fs");
var child_process = require('child_process');
var sleep = require('sleep');
var path = require('path');

var spawn = child_process.spawn;
var folder_watcher = chokidar.watch('/watch', {ignored: /[\/\\]\./, persistent: true});

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
        encode(file, path.dirname(file) + '/' + path.basename(file, '.ts') + '.mkv');
      }
  });

function encode(orig, dest) {
  var args = ['-y',
    '-hwaccel', 'cuvid',
    '-c:v', 'mpeg2_cuvid',
    '-deint', '0', //'adaptive',
    '-drop_second_field', '1',
    '-v', 'verbose',
    '-i', orig,
    '-c:a', 'copy',
    '-c:v', 'h264_nvenc',
    '-preset:v', 'llhq',
    '-b:v', '4M',
    '-profile:v', 'main',
    '-level:v', '4.1',
    '-f', 'matroska',
    dest];
  var ffmpeg = spawn('ffmpeg', args);
  console.log('Spawning ffmpeg ' + args.join(' '));
  ffmpeg.on('exit', function (code, signal) {
    console.log('ffmpeg exited with code ' + code + ' and signal ' + signal);
    if (code === 0) {
      spawn('bash', ['/config/refresh.sh']);
    }
  });
  ffmpeg.stderr.on('data', function (data) {
    console.log('grep stderr: ' + data);
  });
}