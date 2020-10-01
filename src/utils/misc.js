function linkify (inputText, disableLink) {
  if (!inputText) {
    return ''
  }

  if (isTagA(inputText)) {
    return encodeHTML(inputText)
  }

  if (disableLink) {
    return inputText
  }

  // http://, https://, ftp://
  const urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#/%?=~_|!:,.;]*[a-z0-9-+&@#/%=~_|]/gim

  // www. sans http:// or https://
  const pseudoUrlPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim

  // Email addresses
  const emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim

  return inputText
      .replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
      .replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>')
      .replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>')
}

function isTagA (inputText) {
  const tagAPattern = /href\s*=/i
  if (inputText.search(tagAPattern) !== -1) {
    return true
  }
  return false
}

function encodeHTML (inputText) {
  return inputText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
}

function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function isFailedMessage (status, position) {
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
