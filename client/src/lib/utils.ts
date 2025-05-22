export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function getPlayerInfo(userId: string, connectionIds: string[]) {
  const idx = connectionIds.indexOf(userId);
  // Default is connectionId not found
  const data = {
    title: '',
    isPlayer: false,
    isSpectator: false,
    playerNo: 0 // 0 - Spectator, 1,2 - Player
  }

  if (idx > 1) {
    data.title = `Spectator ${idx - 1}`
    data.isSpectator = true
  }
  else if (idx > -1) {
    data.title = `Player ${idx + 1}`
    data.isPlayer = true,
    data.playerNo = idx + 1
  }

  return data
}