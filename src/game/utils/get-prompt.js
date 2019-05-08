import {
  USER_PLAYING,
  USER_WAITING,
  USER_GAME_OVER,
  USER_IN_MENU,
} from '../constants/states'


export default (user) => {
  const { displayName, room } = user
  let prompt = 'Main Menu: '
  switch (user.state) {
    case USER_IN_MENU:
      prompt = 'Main Menu: '
      break
    case USER_WAITING:
      prompt = `${displayName}-${room}: `
      break
    case USER_PLAYING:
      prompt = `${displayName}-${room}: `
      break
    case USER_GAME_OVER:
      prompt = 'GAME OVER'
      break
    default:
      prompt = 'Main Menu: '
  }
  return prompt
}
