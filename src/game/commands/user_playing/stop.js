import { STOPPED, MOVING } from '../../constants/states'


const stop = ({ socket, io, user }) => {
  user.player_state = STOPPED
  clearInterval(user.moveTimer)
  user.moveTimer = undefined
  io.to(socket.id)
    .emit(
      'notification',
      { output: `Stopped. Current Position: (${user.pos.x}, ${user.pos.y})` },
    )
}


stop.str = '/stop'
stop.player_state = MOVING
stop.options = []
// eslint-disable-next-line
stop.desc = 'stop moving'

export default stop
