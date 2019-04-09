import { distance } from 'mathjs'
import { DIR } from '../../constants/numbers'

/*
  check if this player is on a tile visible to another player
  return list of ids and cardinal direction of this player relative to others
*/

export default (user, players) => {
  const seen_by = [] // { id, relative dir}
  const { pos } = user
  players.forEach((p) => {
    const { visible_tiles } = p
    const visible = visible_tiles.filter(tile => tile.x === pos.x && tile.y === pos.y)
    if (visible) {
      const dir = { x: 0, y: -1 }
      const dist = Math.round(distance([user.pos.x, user.pos.y], [pos.x, pos.y]))

      if (pos.x > p.pos.x) {
        dir.x = 1
      } else if (pos.x < p.pos.x) {
        dir.x = -1
      } else {
        dir.x = 0
      }

      if (pos.y > p.pos.y) {
        dir.y = 1
      } else if (pos.y < p.pos.y) {
        dir.y = -1
      } else {
        dir.y = 0
      }

      Object.keys(DIR).forEach((d) => {
        if (DIR[d].x === dir.x && DIR[d].y === dir.y) {
          dir.dir = d
        }
      })

      seen_by.push({
        id: p.id,
        displayName: user.displayName,
        dir,
        dist,
      })
    }
  })

  return seen_by.length > 0 ? seen_by : false
}
