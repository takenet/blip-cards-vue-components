function checkIsExternalMessage(document) {
  const isExternalMessage = Boolean(
    document &&
    document.metadata &&
    document.metadata['#messageEmitter'] &&
    document.metadata['#messageEmitter'] === 'externalMessages'
  )
  return isExternalMessage
}

export {
  checkIsExternalMessage
}
