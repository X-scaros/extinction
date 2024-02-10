const fs = require('fs');
const path = require('path');

console.log(__dirname);

const logPath = path.join(__dirname, 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playersPath = path.join(__dirname, 'players');

const getPlayables = () => {
  const filePath = path.join(__dirname, 'playables.txt');
  const text = fs.readFileSync(filePath, 'utf8');
  const playables = text.split(', ');

  return playables;
};

const monitorLog = () => {
  fs.watch(logPath, (eventType, filename) => {
    console.log(eventType);
    console.log(filename);
  });
};

const playables = getPlayables();

monitorLog();