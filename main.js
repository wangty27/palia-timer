const npcStorageName = 'palia-timer-npc';
const resetStorageName = 'palia-timer-reset';

const resetAllNpc = (resetDate) => {
  const npcStorage = {
    'ashura': false,
    'auni': false,
    'badruu': false,
    'caleri': false,
    'chayne': false,
    'delaila': false,
    'einar': false,
    'elouisa': false,
    'eshe': false,
    'hassian': false,
    'hekla': false,
    'hodari': false,
    'jel': false,
    'jina': false,
    'kenli': false,
    'kenyatta': false,
    'naio': false,
    'najuma': false,
    'reth': false,
    'sifuu': false,
    'subira': false,
    'tamala': false,
    'tau': false,
    'tish': false,
    'zeki': false,
    'zeki-shop': false,
  }
  localStorage.setItem(npcStorageName, JSON.stringify(npcStorage));
  localStorage.setItem(resetStorageName, JSON.stringify({resetDate}));
}

const getNpcGiftState = (npc) => {
  if (!localStorage.getItem(npcStorageName)) {
    resetAllNpc(null);
  }
  const storageObj = JSON.parse(localStorage.getItem(npcStorageName));
  return storageObj[npc];
}

const getAllNpcGiftState = () => {
  if (!localStorage.getItem(npcStorageName)) {
    resetAllNpc(null);
  }
  const storageObj = JSON.parse(localStorage.getItem(npcStorageName));
  return storageObj;
}

const setNpcGiftState = (npc, gifted) => {
  if (!localStorage.getItem(npcStorageName)) {
    resetAllNpc(null);
  }
  const storageObj = JSON.parse(localStorage.getItem(npcStorageName));
  storageObj[npc] = gifted;
  localStorage.setItem(npcStorageName, JSON.stringify(storageObj));
}

const resetAllNpcDailyGift = (date) => {
  resetAllNpc(date);
}

const checkDailyReset = (date) => {
  if (!localStorage.getItem(npcStorageName)) {
    resetAllNpc(null);
  }
  const lastResetDate = JSON.parse(localStorage.getItem(resetStorageName)).resetDate;
  if (date !== lastResetDate) {
    resetAllNpc(date);
  }
}





const parseDuration = (duration) => {
  duration = +duration;
  const days = Math.floor(duration / 8.64e7);
  duration %= 8.64e7;
  const hours = Math.floor(duration / 3.6e6);
  duration %= 3.6e6;
  const minutes = Math.floor(duration / 6e4);
  duration %= 6e4;
  const seconds = Math.floor(duration / 1e3);
  return { days, hours, minutes, seconds };
}

const formatDuration = (duration) => {
  const { days, hours, minutes, seconds } = parseDuration(duration);
  const d = days.toString().padStart(2, '0');
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');
  return days === 0 ? `${h}h, ${m}m, ${s}s` : `${d}d, ${h}h, ${m}m, ${s}s`;
};

const computeDurationTill = (target, date) => {
  return formatDuration(target - date);
}

const getNextDailyReset = (date) => {
  const target = new Date(date);
  target.setDate(target.getDate() + 1);

  const y = target.getUTCFullYear();
  const m = (target.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = target.getUTCDate().toString().padStart(2, '0');
  const targetTimestamp = `${y}-${m}-${d}T04:00:00+00:00`; // UTC
  const targetDate = Date.parse(targetTimestamp);
  
  return targetDate;
}

const getNextWeeklyReset = (date) => {
  const target = new Date(date);
  target.setDate(target.getDate() + (7 - target.getDay()));
  
  const y = target.getUTCFullYear();
  const m = (target.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = target.getUTCDate().toString().padStart(2, '0');
  const targetTimestamp = `${y}-${m}-${d}T04:00:00+00:00`; // UTC
  const targetDate = Date.parse(targetTimestamp);
  
  return targetDate;
};

const handleGiftButtonClick = (npc) => {
  const npcGiftState = getNpcGiftState(npc);
  setNpcGiftState(npc, !npcGiftState);
  document.querySelector(`#npc-gift-${npc}`).classList.toggle('npc-gift-complete');
}

const handleResetButtonClick = () => {
  resetAllNpc(null);
  applyNpcStates();
}

const applyNpcStates = () => {
  const npcState = getAllNpcGiftState();
  for (const [npc, gifted] of Object.entries(npcState)) {
    if (gifted) {
      document.querySelector(`#npc-gift-${npc}`).classList.add('npc-gift-complete');
    } else {
      document.querySelector(`#npc-gift-${npc}`).classList.remove('npc-gift-complete');
    }
    
  }
}

const main = () => {
  const now = new Date();
  document.querySelector('.countdown-daily-timer').innerHTML = computeDurationTill(getNextDailyReset(now), now);
  document.querySelector('.countdown-weekly-timer').innerHTML = computeDurationTill(getNextWeeklyReset(now), now);

  const nextDailyReset = getNextDailyReset(now);
  applyNpcStates();
  checkDailyReset(nextDailyReset);

  setInterval(() => {
    const now = new Date();
    document.querySelector('.countdown-daily-timer').innerHTML = computeDurationTill(getNextDailyReset(now), now);
    document.querySelector('.countdown-weekly-timer').innerHTML = computeDurationTill(getNextWeeklyReset(now), now);

    const nextDailyReset = getNextDailyReset(now);
    applyNpcStates();
    checkDailyReset(nextDailyReset);
  }, 1000);
}



main();