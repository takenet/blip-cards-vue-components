import * as sanitize from 'sanitize-html'

const allowedTags = sanitize.defaults.allowedTags.filter(tag => tag !== 'iframe').concat(['u'])

// Matches any '<' that does not open or close an allowed tag (e.g. '<teste', '<script>')
const disallowedTagOpeningPattern = new RegExp(`<(?!/?(?:${allowedTags.join('|')})(?=[\\s/>]))`, 'gi')

const mixin = (input, options = {}) => {
  const sanitizeOptions = { allowedTags, ...options }

  if (sanitizeOptions.disallowedTagsMode === 'escape' && typeof input === 'string') {
    input = input.replace(disallowedTagOpeningPattern, '&lt;')
  }

  return sanitize(input, sanitizeOptions)
}

export default {
  mixin
}
