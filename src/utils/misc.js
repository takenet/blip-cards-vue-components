function linkify(inputText, disableLink) {
  if (!inputText) {
    return ''
  }

  if (isTagA(inputText)) {
    return encodeHTML(inputText)
  }

  if (disableLink) {
    return inputText
  }

  // Validating url correct Pattern
  // http://, https://, ftp://
  // eslint-disable-next-line no-useless-escape
  const urlValidPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim

  // Pseudo URL correct Pattern
  // www. without http:// or https://
  const pseudoUrlValidPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim

  // Email address correct Pattern
  // Email addresses
  const emailAddressValidPattern = /[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim

  return inputText
    .replace(urlValidPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlValidPattern, '$1<a href="https://$2" target="_blank">$2</a>')
    .replace(emailAddressValidPattern, '<a href="mailto:$&" target="_blank">$&</a>')
}

function isTagA(inputText) {
  const tagAPattern = /href\s*=/i
  if (inputText.search(tagAPattern) !== -1) {
    return true
  }
  return false
}

function encodeHTML(inputText) {
  return inputText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function isFailedMessage(status, position) {
  if (status === 'failed' && position === 'right') {
    return ' failed-message'
  }

  return ''
}

export {
  linkify,
  guid,
  isFailedMessage,
  isTagA,
  encodeHTML
}
