import mime from 'mime-types'

const validator = {
  getMessage (field, args) {
    return 'Invalid mime type'
  },
  validate (value, args) {
    return mime.extension(value) !== false
  }
}

export default validator
