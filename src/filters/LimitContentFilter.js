export default {
  filter: function (content, charLimit) {
    let data = content || ''

    let input = (typeof data === 'object') ? JSON.stringify(data) : data

    if (input && charLimit && input.length > charLimit) {
      return input.slice(0, charLimit) + '...'
    }

    return input
  }
}
