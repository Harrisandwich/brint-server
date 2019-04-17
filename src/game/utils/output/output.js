class Output {
  constructor() {
    this.str = []
  }

  newLines(num) {
    for (let i = 0; i < num; i++) {
      this.str.push('\n')
    }
  }

  addLine(str, options = {}) {
    const { underline, padTop, padBottom } = options

    this.newLines(1)

    if (padTop) {
      this.newLines(padTop)
    }

    if (str) {
      this.str.push(str)
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
    let line = ''
    for (let i = 0; i < length; i++) {
      line += '='
    }
    this.str.push(line)
  }
}

export default Output
