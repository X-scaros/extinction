const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'extinction', 'TheIsle', 'Saved', 'Logs', 'TheIsle.log');
const playablesPath = path.join(__dirname, 'playables.txt');
const playersPath = path.join(__dirname, 'players');

const getPlayables = () => {
  const content = fs.readFileSync(playablesPath, 'utf-8');
  const playables = content.split(', ');

  return playables;
};

const createPlayer = (steamId) => {
  const playtimes = {};

  for (const playable of playables) {
    playtimes[playable] = 0;
  }

  const player = {
    playtimes
  };

  const playerPath = path.join(playersPath, `${steamId}.json`);
  const stringified = JSON.stringify(player, null, 2);

  fs.writeFileSync(playerPath, stringified);
};

const readPlayer = (steamId) => {
  const playerPath = path.join(playersPath, `${steamId}.json`);

  const content = fs.readFileSync(playerPath, 'utf-8');

  const parsed = JSON.parse(content);

  return parsed;
};

const writePlayer = (steamId, data) => {
  const playerPath = path.join(playersPath, `${steamId}.json`);

  const stringified = JSON.stringify(data, null, 2);

  fs.writeFileSync(playerPath, stringified);
};

const getLog = () => {
  const content = fs.readFileSync(logPath, 'utf-8');
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

const processLines = (lines) => {
  for (const line of lines) {
    for (const [regex, action] of regexes) {
      if (!regex.test(line)) {
        continue;
      }

      const match = line.match(regex);

      const steamId = match[1];
      const playable = match[2];

      action(steamId, playable);

      break;
    }
  }
};

const monitorLog = () => {
  const watcher = fs.watch(logPath);

  watcher.on('change', () => {
    const newLines = getNewLines();

    processLines(newLines);
  });
};

const actions = {
  startTimer(steamId, playable) {
    const timer = {
      playable,
      time: Date.now()
    };

    timers[steamId] = timer;
  },
  stopTimer(steamId, playable) {
    const playerPath = path.join(playersPath, `${steamId}.json`);

    if (!fs.existsSync(playerPath)) {
      createPlayer(steamId);
    }

    const player = readPlayer(steamId);

    const elapsedTime = Date.now() - player.playtimes[playable];

    player.playtimes[playable] += elapsedTime;

    writePlayer(steamId, player);
  }
};

const regexes = new Map([
  [
    /(\d{17})\] Joined The Server\. Save file found Dino: BP_([a-zA-Z]*)/,
    actions.startTimer
  ],
  [
    /(\d{17})\] Save file not found - Starting as fresh spawn. Class: BP_([a-zA-Z]*)/,
    actions.startTimer
  ],
  [
    /(\d{17})\] Left The Server while not being safelogged, Was playing as: ([a-zA-Z]*)/,
    actions.stopTimer
  ],
  [
    /(\d{17})\] Left The Server whilebeing safelogged, Was playing as: ([a-zA-Z]*)/,
    actions.stopTimer
  ],
  [
    /(\d{17})\] Dino: ([a-zA-Z]*), .*, .* - Died from Natural cause/,
    actions.stopTimer
  ]
]);

const timers = {};

const playables = getPlayables();

let previousLog = getLog();

monitorLog();
