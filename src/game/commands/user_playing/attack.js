/* eslint-disable max-len */
import { STOPPED } from '../../constants/states'
import { canSeeEnemy } from '../../utils/gameplay'


const attack = ({ socket, io, user, users }) => {
  // const room = rooms[user.room]
  const players = Object.values(users).filter(u => u.room === user.room && u.id !== user.id)
  const equipped = user.inventory[user.equipped]
  const visiblePlayers = canSeeEnemy(user, players)
  const inRange = visiblePlayers.filter(p => p.dist <= equipped.range)
  const closest = inRange.reduce((prev, curr) => (prev.dist < curr.dist ? prev : curr))

  if (closest) {
    const target = players.find(p => p.id === closest.id)
    if (Math.random() <= equipped.accuracy) {
      target.health -= equipped.damage
      io.to(socket.id)
        .emit(
          'notification',
          { msg: `You hit ${target.displayName} with your ${equipped.name} for ${equipped.damage}!` },
        )
      io.to(target.id)
        .emit(
          'notification',
          { msg: `You were hit by ${user.displayName}'s ${equipped.name} and tooke ${equipped.damage}!` },
        )
    }
  }
}


attack.str = '/attack'
attack.short = 'atk'
attack.player_state = STOPPED
attack.options = [{
  name: 'dir',
  short: 'dr',
  type: 'string',
  desc: 'The cardinal direction to attack in. n/ne/e/se/s/sw/w/nw. If not specified, attacks closest target',
  required: false,
}]
// eslint-disable-next-line
attack.desc = 'attack moving'

export default attack
