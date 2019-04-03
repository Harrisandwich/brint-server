import {
  PLAYER_PLAYING,
  PLAYER_WAITING,
  PLAYER_GAME_OVER,
  PLAYER_IN_MENU,
} from '../constants/states'


export default (state, socket, io, props) => {
  const { user } = props
  user.state = state
  let prompt = 'Main Menu: '
  switch (state) {
    case PLAYER_IN_MENU:
      prompt = 'Main Menu: '
      break
    case PLAYER_WAITING:
      prompt = `${props.displayName}-${props.roomCode}: `
      break
    case PLAYER_PLAYING:
      prompt = `${props.displayName}-${props.roomCode}: `
      break
    case PLAYER_GAME_OVER:
      prompt = 'GAME OVER'
      break
    default:
      prompt = 'Main Menu: '
  }
  io.to(socket.id).emit('set-appstate', {
    prompt,
    state,
  })
}
