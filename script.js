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

const getNewLines = () => {
  const currentLog = getLog();

  const newLines = currentLog.slice(previousLog.length);
  previousLog = currentLog;
  
  return newLines;
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    const newLines = getNewLines();
    
    for (const line of newLines) {
      console.log(line);
    }
  });
};

let previousLog = getLog();

const playables = getPlayables();

monitorLog();
