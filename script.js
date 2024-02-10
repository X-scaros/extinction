const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'X-tinction', 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playablesPath = path.join(__dirname, 'playables.txt');
const playersPath = path.join(__dirname, 'players');

const getPlayables = () => {
  const buffer = fs.readFileSync(playablesPath);
  const content = buffer.toString();

  const playables = content.split(', ');

  return playables;
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    const buffer = fs.readFileSync(logPath);
    const content = buffer.toString();

    const currentLines = content.split('\r\n');
    currentLines.pop();

    const lines = currentLines.slice(previousLines.length);
    console.log(lines);
  });

  const previousLines = [];
};

const playables = getPlayables();

monitorLog();
