const fs = require('fs');
const path = require('path');

console.log(__dirname);

const logPath = path.join(__dirname, '..', 'X-tinction', 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playersPath = path.join(__dirname, 'players');

const getPlayables = () => {
  const filePath = path.join(__dirname, 'playables.txt');

  const text = fs.readFileSync(filePath, 'utf8');

  const playables = text.split(', ');

  return playables;
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    console.log('change');
  });
};

const playables = getPlayables();
console.log(playables);

monitorLog();
