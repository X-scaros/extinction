const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'extinction', 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playablesPath = path.join(__dirname, 'playables.txt');
const playersPath = path.join(__dirname, 'players');

const getPlayables = () => {
  const buffer = fs.readFileSync(playablesPath);
  const content = buffer.toString();

  const playables = content.split(', ');

  return playables;
};

const getLog = () => {
  const buffer = fs.readFileSync(logPath);
  const content = buffer.toString();

  const log = content.split('\r\n');
  log.pop();

  return log;
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    const currentLog = getLog();

    const lines = currentLog.slice(previousLog.length);

    previousLog = lines;
    console.log(lines);
  });

  const previousLog = getLog();
};

const playables = getPlayables();

monitorLog();
