import { find } from 'lodash'
import randomstring from 'randomstring'
import setAppstate from '../../utils/set-appstate'
import { generateMap } from '../../utils/generate'
import { PLAYER_CAP, MAP_SIZE } from '../../constants/numbers'
import {
  PLAYER_PLAYING,
  PLAYER_WAITING,
  GAME_WAITING,
  GAME_IN_PROGRESS,
} from '../../constants/states'


const join = ({ payload, socket, io, user, rooms }) => {
  const resp = {}
  const displayName = payload.options.find(o => o.option === 'as').values[0]
  let roomCode = ''

  const validRoom = find(rooms, room => room.id && room.players < PLAYER_CAP)

  if (validRoom) {
    roomCode = validRoom.id
    validRoom.players += 1
    if (validRoom.players === PLAYER_CAP) {
      validRoom.state = GAME_IN_PROGRESS
    }
  } else {
    let newId = ''
    do {
      newId = randomstring.generate(5)
    } while (rooms[newId])
    const newRoom = {
      id: newId,
      players: 1,
      map: generateMap(MAP_SIZE),
      state: GAME_WAITING,
    }
    rooms[newId] = newRoom
    roomCode = newId
  }
  let joinSuccess = false
  socket.join(roomCode, () => {
    const thisRoom = rooms[roomCode]
    user.room = roomCode
    user.displayName = displayName
    resp.output = `You have successully joined room ${roomCode}`
    io.to(socket.id).emit('command-response', resp)

    if (thisRoom.state === GAME_WAITING) {
      setAppstate(PLAYER_WAITING, socket, io, {
        displayName,
        roomCode,
        user,
      })
      io.to(`${roomCode}`)
        .emit(
          'notification',
          { msg: `Waiting for players: ${thisRoom.players}/${PLAYER_CAP}` },
        )
    } else if (thisRoom.state === GAME_IN_PROGRESS) {
      setAppstate(PLAYER_PLAYING, socket, io, {
        displayName,
        roomCode,
        user,
      })
      io.to(`${roomCode}`)
        .emit(
          'notification',
          { msg: 'Let the battle begin!' },
        )
    }
    joinSuccess = true
  })
  if (joinSuccess) {
    return true
  }
  io
    .to(socket.id)
    .emit('error', { output: 'Join failed. Check back in a bit' })
  return false
}

join.str = '/join'
join.options = [{
  name: 'as',
  type: 'string',
  desc: 'The display name you wish to use. Defaults to "Player".',
  required: true, // probably will be required later
}]
// eslint-disable-next-line
join.desc = 'Join a game'

export default join
