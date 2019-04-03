export default (size) => {
  const map = {}

  for (let r = 0; r < size; r++) {
    map[r] = {}
    const row = map[r]
    for (let c = 0; c < size; c++) {
      row[c] = {
        loot: [],
        x: c,
        y: r,
      }
      const column = row[c]
      column.canSpawn = column.loot.length === 0
    }
  }

  return map
}
