import {
  USER_PLAYING,
  USER_WAITING,
  USER_GAME_OVER,
  USER_IN_MENU,
} from '../constants/states'


export default (state, socket, io, props) => {
  const { user } = props
  user.state = state
  let prompt = 'Main Menu: '
  switch (state) {
    case USER_IN_MENU:
      prompt = 'Main Menu: '
      break
    case USER_WAITING:
      prompt = `${props.displayName}-${props.roomCode}: `
      break
    case USER_PLAYING:
      prompt = `${props.displayName}-${props.roomCode}: `
      break
    case USER_GAME_OVER:
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
