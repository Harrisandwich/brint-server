import { DIR } from '../../constants/numbers'
import { STOPPED, MOVING } from '../../constants/states'


const move = ({ payload, socket, io, user, rooms }) => {
  const dir = payload.options.find(o => o.option === 'dir').values[0]
  const dist = payload.options.find(o => o.option === 'dist').values[0]
  const direction = DIR[dir]
  user.player_state = MOVING
  user.moveTimer = setInterval(() => {

  }, user.speed)
}


move.str = '/move'
move.player_state = STOPPED
move.options = [{
  name: 'dir',
  type: 'string',
  desc: 'The cardinal direction to move in. n/ne/e/se/s/sw/w/nw',
  required: true,
}, {
  name: 'dist',
  type: 'number',
  desc: 'The number of tiles you want to travel',
  required: true,
}]
// eslint-disable-next-line
move.desc = 'Move in the world'

export default move
