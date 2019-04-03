import { USER_PLAYING } from '../../constants/states'


const getDisplayName = user => user.displayName


const message = ({ payload, io, user }) => {
  const message = payload.options.find(o => o.option === 'txt').values[0]
  const roomCode = user.room
  const displayName = getDisplayName(user)

  if (user.state === USER_PLAYING) {
    io.to(roomCode).emit('message', {
      output: message,
      displayName,
    })
  }

  return true
}

message.str = '/message'
message.hidden = true // doesn't show up in /help
message.options = []
// eslint-disable-next-line
message.desc = ''

export default message
