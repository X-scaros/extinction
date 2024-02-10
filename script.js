const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'extinction', 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playablesPath = path.join(__dirname, 'playables.txt');
const playersPath = path.join(__dirname, 'players');

const regexes = {
  found: /(\d{17})\] Joined The Server\. Save file found Dino: BP_([a-zA-Z]*)/,
  fresh: /(\d{17})\] Save file not found - Starting as fresh spawn. Class: BP_([a-zA-Z]*)/,
  left: /(\d{17})\] Left The Server while not being safelogged, Was playing as: ([a-zA-Z]*)/,
  safelogged: /(\d{17})\] Left The Server whilebeing safelogged, Was playing as: ([a-zA-Z]*)/,
  naturalcauses: /(\d{17})\] Dino: ([a-zA-Z]*), .*, .* - Died from Natural cause/
};

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

const matchLines = (lines) => {
  for (const key in regexes) {
    const regex = regexes[key];

    for (const line of lines) {
      if (regex.test(line)) {
        const match = line.match(regex);
        return match;
      }
    }
  }
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    const newLines = getNewLines();
    const match = matchLines(newLines);
    console.log(match);
  });
};

const playables = getPlayables();

let previousLog = getLog();

monitorLog();
