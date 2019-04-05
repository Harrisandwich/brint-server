import { DIR, MAP_SIZE } from '../../constants/numbers'
import { STOPPED, MOVING } from '../../constants/states'
import { getPlayerVisRange } from '../../utils/gameplay'


const move = ({ payload, socket, io, user, rooms, users }) => {
  const room = rooms[user.room]
  const players = Object.values(users).filter(u => u.room === user.room)
  const dir = payload.options.find(o => o.option === 'dir').values[0]
  const dist = payload.options.find(o => o.option === 'dist').values[0]
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

      // Check if other players are visible
      // if so, notify
      // Check if visible to other players
      // if so, notify other players

      io.to(socket.id)
        .emit(
          'notification',
          { msg: `Map edge reached. Current Position: (${user.pos.x}, ${user.pos.y})` },
        )
    } else {
      user.pos = newPos
      const { visible_tiles } = getPlayerVisRange(user, room.map, players)
      user.visible_tiles = visible_tiles

      // Check if other players are visible
      // if so, notify
      // Check if visible to other players
      // if so, notify other players

      io.to(socket.id)
        .emit(
          'notification',
          { msg: `You moved one tile. (${oldPos.x}, ${oldPos.y}) to (${newPos.x}, ${newPos.y})` },
        )
      // check for other players within visible area
      /*
          get top left of vision
          get max visible rows
          get max visible columns
          loop through users in this room
          if user pos matches a visible tile
          notify the user
      */
      moveCounter += 1
      if (moveCounter === dist) {
        clearInterval(user.moveTimer)
        user.moveTimer = undefined
        user.player_state = STOPPED
        io.to(socket.id)
          .emit(
            'notification',
            { msg: `Move complete. Current Position: (${user.pos.x}, ${user.pos.y})` },
          )
      }
    }
  }, user.speed)
}


move.str = '/move'
move.player_state = STOPPED
move.options = [{
  name: 'dir',
  type: 'string',
  desc: 'The cardinal direction to move in. n/ne/e/se/s/sw/w/nw',
  required: true,
}, {
  name: 'dist',
  type: 'number',
  desc: 'The number of tiles you want to travel',
  required: true,
}]
// eslint-disable-next-line
move.desc = 'Move in the world'

export default move
