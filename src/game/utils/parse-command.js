import hasValidOptions from './has-valid-options'
import commands from '../commands'
import { PLAYER_WAITING } from '../constants/states'
import { PLAYER_CAP } from '../constants/numbers'


export default (props) => {
  const { payload, user, socket, io, rooms } = props
  const thisRoom = rooms[user.room]
  const category = commands[user.state]
  const command = category && category[payload.command]
    ? category[payload.command] : commands.general[payload.command]

  if (user.state === PLAYER_WAITING) {
    io
      .to(socket.id)
      .emit(
        'notification',
        { msg: `Currently waiting for players: ${thisRoom.players}/${PLAYER_CAP}` },
      )
  } else if (command) {
    const optionsValid = hasValidOptions(command, payload)
    if (optionsValid.valid) {
      command(props)
    }
    io.to(socket.id).emit('error', { output: optionsValid.msg })
  } else {
    io
      .to(socket.id)
      .emit(
        'error',
        { output: 'Invalid command. Use "/help" to see available commands' },
      )
  }
}
