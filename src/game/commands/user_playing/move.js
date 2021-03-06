import { DIR, MAP_SIZE } from '../../constants/numbers'
import { STOPPED, MOVING } from '../../constants/states'
import { getPlayerVisRange, seenByEnemy, canSeeEnemy } from '../../utils/gameplay'


const move = ({ payload, socket, io, user, rooms, users }) => {
  const room = rooms[user.room]
  const players = Object.values(users).filter(u => u.room === user.room && u.id !== user.id)
  const dir = payload.options.find(o => o.option === 'dir' || o.option === 'dr').values[0]
  const dist = payload.options.find(o => o.option === 'dist' || o.option === 'dst').values[0]
  const direction = DIR[dir]
  let moveCounter = 0
  user.player_state = MOVING
  user.moveTimer = setInterval(() => {
    const newPos = {
      x: user.pos.x + direction.x,
      y: user.pos.y + direction.y,
    }
    const oldPos = { ...user.pos }
    // if new pos is at the limits of the map
    if (newPos.x >= MAP_SIZE - 1
      || newPos.y >= MAP_SIZE - 1
      || newPos.x <= 0
      || newPos.y <= 0) {
      clearInterval(user.moveTimer)
      user.moveTimer = undefined
      user.player_state = STOPPED
      const { visible_tiles } = getPlayerVisRange(user, room.map, players)
      user.visible_tiles = visible_tiles

      io.to(socket.id)
        .emit(
          'notification',
          { output: `Map edge reached. Current Position: (${user.pos.x}, ${user.pos.y})` },
        )
    } else {
      user.pos = newPos
      const { visible_tiles } = getPlayerVisRange(user, room.map, players)
      user.visible_tiles = visible_tiles
      io.to(socket.id)
        .emit(
          'notification',
          // eslint-disable-next-line max-len
          { output: `You moved one tile. (${oldPos.x}, ${oldPos.y}) to (${newPos.x}, ${newPos.y})` },
        )

      moveCounter += 1
      if (moveCounter === dist) {
        clearInterval(user.moveTimer)
        user.moveTimer = undefined
        user.player_state = STOPPED
        io.to(socket.id)
          .emit(
            'notification',
            { output: `Move complete. Current Position: (${user.pos.x}, ${user.pos.y})` },
          )
      }
    }
    // Check if other players are visible
    const canSee = canSeeEnemy(user, players)
    // if so, notify
    if (canSee) {
      canSee.forEach((p) => {
        io
          .to(socket.id)
          .emit(
            'notification',
            { output: `You see another player to the ${p.dir.key}. ${p.dist} tiles away` },
          )
      })
    }
    // Check if visible to other players
    const visibleTo = seenByEnemy(user, players)
    // if so, notify other players
    if (visibleTo) {
      visibleTo.forEach((p) => {
        io.to(p.id)
          .emit(
            'notification',
            { output: `You see another player to the ${p.dir.key}. ${p.dist} tiles away` },
          )
      })
    }
  }, user.speed)
}


move.str = '/move'
move.short = 'mv'
move.player_state = STOPPED
move.options = [{
  name: 'dir',
  short: 'dr',
  type: 'string',
  desc: 'The cardinal direction to move in. n/ne/e/se/s/sw/w/nw',
  required: true,
}, {
  name: 'dist',
  short: 'dst',
  type: 'number',
  desc: 'The number of tiles you want to travel',
  required: true,
}]
// eslint-disable-next-line
move.desc = 'Move in the world'

export default move
