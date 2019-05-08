import getPrompt from '../utils/get-prompt'
import EVENTS from '../constants/events'


class User {
  constructor(socket, initialState, io) {
    this._socket = socket
    this._io = io
    this._room = ''
    this._displayName = 'Player'
    this._state = initialState
    // Game Props
    this._position = {
      x: 0,
      y: 0,
      node_id: '',
    }
    this._connection = 100
    this._bandwidth = 100
    this._visibleNodes = []
    this._inventory = []
    this._programs = []
    this._path = []
  }

  get id() {
    return this._socket.id
  }

  get room() {
    return this._room
  }

  get displayName() {
    return this._displayName
  }

  set displayName(newDisplayName) {
    this._displayName = newDisplayName
    return this._displayName
  }

  get state() {
    return this._state
  }

  set state(newState) {
    this._previousState = this._state
    this._state = newState
    this.toSelf(EVENTS.APPSTATE, {
      prompt: getPrompt(this),
      state: this._state,
    })
    return this._state
  }

  get position() {
    return this._position
  }

  get connection() {
    return this._connection
  }

  get bandwidth() {
    return this._bandwidth
  }

  get visibleNodes() {
    return this._visibleNodes
  }

  join(room_id, display_name) {
    this._room = room_id
    this._displayName = display_name
    return {
      id: this._id,
      room: this._room,
      displayName: this._displayName,
    }
  }

  queueMove(nextPos) {
    this._path.push(nextPos)
    return this._path
  }

  move() {
    const { x, y, node_id } = this._path[0]
    this._position = {
      x,
      y,
      node_id,
    }
    this._path.shift()
    return {
      position: this._position,
      path: this._path,
    }
  }

  toRoom(event, payload) {
    this._io.to(`${this._room}`).emit(event, payload)
  }

  toSelf(event, payload) {
    this._io.to(`${this._socket.id}`).emit(event, payload)
  }
}

export default User
