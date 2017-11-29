const validator = {
  getMessage (field, args) {
    return 'Invalid mime type'
  },
  validate (value, args) {
    return value.match(/.+\/.+/) != null
  }
}

export default validator
