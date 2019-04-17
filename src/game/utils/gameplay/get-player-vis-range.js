export default (user, map, players) => {
  const visible_tiles = []
  const grid = []
  let vis_range = (user.view_dist * user.scope)
  if (vis_range % 2 === 0) {
    vis_range += 1
  }
  const tl = {
    x: (user.pos.x - vis_range),
    y: (user.pos.y - vis_range),
  }
  const tr = {
    x: (user.pos.x + vis_range),
    y: (user.pos.y - vis_range),
  }
  const br = {
    x: (user.pos.x + vis_range),
    y: (user.pos.y + vis_range),
  }

  for (let r = tl.y; r <= br.y; r++) {
    let row = ''
    let lineRow = ''
    for (let l = tl.x; l <= tr.x; l++) {
      lineRow += '----'
    }
    grid.push(lineRow)
    for (let c = tl.x; c <= tr.x; c++) {
      const tile_data = map[r][c]
      visible_tiles.push({
        x: c,
        y: r,
        tile_data,
      })
      const playerHere = players.find(p => p.pos.x === c
        && p.pos.y === r
        && p.id !== user.id)
      if (c === user.pos.x && r === user.pos.y) {
        row += '| x '
      } else if (tile_data.loot.length > 0) {
        row += '| * '
      } else if (playerHere) {
        row += '| p '
      } else {
        row += '| _ '
      }
    }
    row += '|'
    grid.push(row)
  }
  return {
    visible_tiles,
    grid,
  }
}
