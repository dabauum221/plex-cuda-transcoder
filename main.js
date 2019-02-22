var chokidar = require('chokidar');
var fs = require("fs");
var child_process = require('child_process');
var sleep = require('sleep');
var path = require('path');

var spawn = child_process.spawn;

var folder_watcher = chokidar.watch('/watch', {ignored: /[\/\\]\./, persistent: true});

folder_watcher
  .on('add', function(file) {
      console.log('File', file, 'has been added');
      var fileSizeInBytes;
      do {
          fileSizeInBytes = fs.statSync(file)["size"];
          console.log('Still copying');
          sleep.sleep(10);
      } while(fs.statSync(file)["size"] !== fileSizeInBytes);
      console.log('Done copying', file);
      encode(file, path.dirname(file) + '/' + path.basename(file, '.ts') + '.mkv');
  });

function encode(orig, dest) {
    var args = ['-y',
                '-threads', '4',
                '-hwaccel', 'cuvid',
                '-c:v', 'mpeg2_cuvid',
                '-deint', 'adaptive',
                '-drop_second_field', '1',
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
    });
    ffmpeg.stderr.on('data', function (data) {console.log('grep stderr: ' + data);});
}