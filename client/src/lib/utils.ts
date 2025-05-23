export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function getPlayerInfo(userId: string, connectionIds: string[], activePlayerNo: number) {
  const idx = connectionIds.indexOf(userId);
  // Default is connectionId not found
  const data = {
    title: '',
    isPlayer: false,
    isSpectator: false,
    isActivePlayer: false,
    playerNo: 0 // 0 - Spectator, 1,2 - Player
  }

  if (idx > 1) {
    data.title = `Spectator ${idx - 1}`
    data.isSpectator = true
  }
  else if (idx > -1) {
    const playerNo = idx + 1
    data.playerNo = playerNo
    data.title = `Player ${playerNo}`
    data.isPlayer = true
    data.isActivePlayer = playerNo == activePlayerNo
  }

  return data
}