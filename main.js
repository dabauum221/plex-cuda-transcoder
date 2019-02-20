var chokidar = require('chokidar');
var fs = require("fs");
var child_process = require('child_process');
var sleep = require('sleep');

var spawn = child_process.spawn;

var folder_watcher = chokidar.watch('/watch', {ignored: /[\/\\]\./, persistent: true});

folder_watcher
  .on('add', function(path) {
      console.log('File', path, 'has been added');
      var fileSizeInBytes;
      do {
          fileSizeInBytes = fs.statSync(path)["size"];
          console.log('Still copying');
          sleep.sleep(10);
      } while(fs.statSync(path)["size"] !== fileSizeInBytes);
      console.log('Done copying', path);
      encode(path);
  });

function encode(path) {
    var args = ['-y',
                '-threads', '4',
                '-hwaccel', 'cuvid',
                '-c:v', 'mpeg2_cuvid',
                '-deint', 'adaptive',
                '-drop_second_field', '1',
                '-i', path,
                '-c:a', 'copy',
                '-c:v', 'h264_nvenc',
                '-preset:v', 'llhq',
                '-b:v', '4M',
                '-profile:v', 'main',
                '-level:v', '4.1',
                '-f', 'matroska',
                '/output/result.mkv'];
    var ffmpeg = spawn('ffmpeg', args);
    console.log('Spawning ffmpeg ' + args.join(' '));
    ffmpeg.on('exit', function (code, signal) {
        console.log('ffmpeg exited with code ' + code + ' and signal ' + signal);
    });
    ffmpeg.stderr.on('data', function (data) {console.log('grep stderr: ' + data);});
}