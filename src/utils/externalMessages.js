function checkIsExternalMessage(document) {
  return document && document.metadata && document.metadata['#messageEmitter'] === 'externalMessages'
}

export {
  checkIsExternalMessage
}
