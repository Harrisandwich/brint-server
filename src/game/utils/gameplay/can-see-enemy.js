import { distance } from 'mathjs'
import { DIR } from '../../constants/numbers'

/*
  check if there's player(s) in visible range
  return cardinal direction of visible player(s)
*/

export default (user, players) => {
  const can_see = [] // { id, relative dir}
  const { visible_tiles } = user
  players.forEach((p) => {
    const { pos } = p
    const visible = visible_tiles.filter(tile => tile.x === pos.x && tile.y === pos.y)
    if (visible) {
      const dir = { x: 0, y: -1 }
      const dist = Math.round(distance([user.pos.x, user.pos.y], [pos.x, pos.y]))

      if (pos.x > user.pos.x) {
        dir.x = 1
      } else if (pos.x < user.pos.x) {
        dir.x = -1
      } else {
        dir.x = 0
      }

      if (pos.y > user.pos.y) {
        dir.y = 1
      } else if (pos.y < user.pos.y) {
        dir.y = -1
      } else {
        dir.y = 0
      }

      Object.keys(DIR).forEach((d) => {
        if (DIR[d].x === dir.x && DIR[d].y === dir.y) {
          dir.key = d
        }
      })

      can_see.push({
        id: p.id,
        displayName: p.displayName,
        dir,
        dist,
      })
    }
  })

  return can_see.length > 0 ? can_see : false
}
