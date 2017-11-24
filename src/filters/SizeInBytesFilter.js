import Vue from 'vue'

Vue.filter('sizeInBytesFilter', function (size) {
  var SIZES = ['B', 'KB', 'MB', 'GB']
  console.log(SIZES)

  if (!size) {
    return ''
  }

  var log = Math.floor(Math.log(size) / Math.log(1024))
  var number = log === 0 ? size : (size / (1024 * log)).toFixed(1)

  return number + SIZES[log]
})
