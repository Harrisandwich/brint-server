import commands from '../index'
import { Output } from '../../utils/output'


const help = ({ payload, socket, io, user }) => {
  const resp = {}

  const output = new Output('\n\n')

  if (payload.options.length > 0) {
    const cmdNames = payload.options.find(op => op.option === 'cmd').values
    const category = {
      ...commands[user.state],
      ...commands.general,
    }
    cmdNames.forEach((cmdName) => {
      const command = category[cmdName]
      output.addLine(`${command.str}`, { underline: true })
      output.addLine(`${command.desc}`, { padBottom: 1 })
      output.addLine('Parameters:')
      command.options.forEach((op) => {
        output.addLine(`  * ${op.name}${op.required ? '' : '?'} - ${op.desc}`)
        output.addLine(`    - takes: ${op.type}`)
      })
    })
    resp.output = output.str
    io.to(socket.id).emit('command-response', resp)
    return true
  }
  // eslint-disable-next-line
  output.addLine('Use "/help -cmd [command]" on a command below to see more details and optional params')
  output.addLine('For example: "/help -cmd join"', { padBottom: 1 })
  output.addLine('General Commands', { underline: true })
  Object.values(commands.general).forEach((cmd) => {
    if (!cmd.hidden) {
      output.addLine(`${cmd.str}: ${cmd.desc}`)
    }
  })

  output.addLine('Commands Currently Available', { underline: true, padTop: 1 })
  const availableCommands = {
    ...commands[user.state],
    ...commands.general,
  }
  Object.values(availableCommands).forEach((cmd) => {
    if (!cmd.hidden) {
      output.addLine(`${cmd.str}: ${cmd.desc}`)
      cmd.options.forEach((op) => {
        if (op.required) {
          output.addLine(`  * -${op.name}: ${op.desc}, takes: ${op.type}`)
        }
      })
    }
  })
  resp.output = output.str
  io.to(socket.id).emit('command-response', resp)
  return true
}

help.str = '/help'
help.options = [{
  name: 'cmd',
  type: '[strings]',
  desc: 'a list of names (space separated) of he commands you want help with',
  required: false,
}]
// eslint-disable-next-line
help.desc = 'Lists all available commands for the current app state (menu, in-game as character, in-game as dm, etc)'

export default help
