const validator = {
  getMessage (field, args) {
    return 'Invalid JSON'
  },
  validate (value, args) {
    try {
      JSON.parse(value)
      return true
    } catch (e) {
      return false
    }
  }
}

export default validator
