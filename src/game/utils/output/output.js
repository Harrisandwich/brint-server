class Output {
  constructor(startStr) {
    this.str = startStr || ''
  }

  newLines(num) {
    for (let i = 0; i < num; i++) {
      this.str += '\n'
    }
  }

  addLine(str, options = {}) {
    const { underline, padTop, padBottom } = options

    this.newLines(1)

    if (padTop) {
      this.newLines(padTop)
    }

    if (str) {
      this.str += str
    }

    if (underline) {
      this.underline(str.length)
    }

    this.newLines(1)

    if (padBottom) {
      this.newLines(padBottom)
    }
  }

  underline(length) {
    this.str += '\n'
    for (let i = 0; i < length; i++) {
      this.str += '='
    }
  }
}

export default Output
