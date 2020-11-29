var chokidar = require('chokidar');
var fs = require("fs");
const execSync = require('child_process').execSync;
var sleeper = require('sleep');
var path = require('path');
var queue = require('better-queue');

var watcher = chokidar.watch('/watch', {
  ignored: /[\/\\]\./,
  persistent: true
});

var q = new queue(function (input, cb) {
  console.log('Started job for', input.file);
  var fileSizeInBytes;
  do {
    fileSizeInBytes = fs.statSync(input.file)["size"];
    console.log(input.file, 'is still being written, waiting 5 seconds...');
    sleeper.sleep(5);
  } while(fs.statSync(input.file)["size"] !== fileSizeInBytes);
  transcode(input.file, path.dirname(input.file) + '/' + path.basename(input.file, '.ts') + '.mkv');
  post(input.file);
  console.log('Done!!!');
  cb(null, result);
});

watcher
  .on('add', function(file) {
    if (file.endsWith('.ts')) {
      console.log('File', file, 'has been added');
      q.push({file: file})
    }
  })
  .on('change', function(file) {
    console.log('File', file, 'changed');
  })
  .on('error', function(file) {
    console.log('Watch error for', file);
  });

function transcode(source, dest) {
  let ffmpegScript = process.env.SCRIPT;
  var args = [ffmpegScript, source, dest];
  var argsJoined = args.join('" "');
  console.log('Executing', `"${argsJoined}"`);
  execSync(`"${argsJoined}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

function post(source) {
  let postScript = process.env.POST_SCRIPT;
  var args = [postScript, source];
  var argsJoined = args.join('" "');
  console.log('Executing', `"${argsJoined}"`);
  execSync(`"${argsJoined}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
