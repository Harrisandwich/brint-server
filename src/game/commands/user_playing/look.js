import { STOPPED } from '../../constants/states'
import { getPlayerVisRange } from '../../utils/gameplay'


const look = ({ socket, io, user, users, rooms }) => {
  const room = rooms[user.room]
  const players = Object.values(users).filter(u => u.room === user.room)
  const { visible_tiles, grid } = getPlayerVisRange(user, room.map, players)
  user.visible_tiles = visible_tiles
  user.visible_grid = grid
  io.to(socket.id)
    .emit(
      'notification',
      { msg: grid },
    )
}


look.str = '/look'
look.player_state = STOPPED
look.options = []
// eslint-disable-next-line
look.desc = 'look'

export default look
