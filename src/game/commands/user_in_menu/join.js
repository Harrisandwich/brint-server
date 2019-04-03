import { find } from 'lodash'
import randomstring from 'randomstring'
import setAppstate from '../../utils/set-appstate'
import { generateMap } from '../../utils/generate'
import { PLAYER_CAP, MAP_SIZE } from '../../constants/numbers'
import {
  USER_PLAYING,
  USER_WAITING,
  GAME_WAITING,
  GAME_IN_PROGRESS,
  STOPPED,
} from '../../constants/states'


const join = ({ payload, socket, io, user, rooms }) => {
  const resp = {}
  const displayName = payload.options.find(o => o.option === 'as').values[0]
  let roomCode = ''

  const validRoom = find(rooms, room => room.id && room.players < PLAYER_CAP)

  if (validRoom) {
    roomCode = validRoom.id
    validRoom.players += 1
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
  socket.join(roomCode, () => {
    const thisRoom = rooms[roomCode]
    const spawnPos = {
      x: Math.round((MAP_SIZE - 1) / 2),
      y: Math.round((MAP_SIZE - 1) / 2),
    }
    if (thisRoom.players === PLAYER_CAP) {
      thisRoom.state = GAME_IN_PROGRESS
    }


    user.room = roomCode
    user.displayName = displayName
    user.inventory = [{
      name: 'fist',
      range: 1,
      accuracy: 100,
    }]
    user.armour = 0
    user.helmet = 0
    user.moveTimer = undefined
    user.equipped = 0
    user.speed = 1000
    user.player_state = STOPPED
    user.pos = { ...spawnPos }

    resp.output = `You have successully joined room ${roomCode}`
    io.to(socket.id).emit('command-response', resp)

    if (thisRoom.state === GAME_WAITING) {
      setAppstate(USER_WAITING, socket, io, {
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
      setAppstate(USER_PLAYING, socket, io, {
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
  })
  return true
}

join.str = '/join'
join.options = [{
  name: 'as',
  type: 'string',
  desc: 'The display name you wish to use.',
  required: true, // probably will be required later
}]
// eslint-disable-next-line
join.desc = 'Join a game'

export default join
