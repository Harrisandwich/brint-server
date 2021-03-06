
export default (command, payload) => {
  const result = {
    valid: true,
    output: '',
  }

  command.options.forEach((option) => {
    if (option.required) {
      const exists = payload.options.find(op => op.option === option.name
        || op.option === option.short)
      if (!exists || exists.values.length === 0) {
        result.valid = false
        result.msg = `Required option "${option.name}" not found`
      }
    }
  })

  return result
}
