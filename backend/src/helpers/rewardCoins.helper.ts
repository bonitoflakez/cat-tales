export function checkLevelUp(currentLvl: number, nextLvl: number): Boolean {
  if (currentLvl < nextLvl) {
    return true;
  } else {
    return false;
  }
}

export function calculateCoinReward(lvl: number): number {
  if (lvl > 0 && lvl < 100) {
    return 100;
  } else if (lvl > 100 && lvl < 1000) {
    return 200;
  } else {
    return 300;
  }
}
