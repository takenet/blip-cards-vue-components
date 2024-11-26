import { MessageTypesConstants } from '../utils/MessageTypesConstants.js'

function checkIsExternalMessage(msg) {
  let innerDocument

  if (msg && msg.document) {
    innerDocument = msg.document
  } else {
    innerDocument = msg
  }

  const isExternalMessage = Boolean(
    innerDocument &&
    (checkIfIsExternalMessageType(innerDocument) || checkIfHasMessageEmitterMetadata(innerDocument))
  )

  return isExternalMessage
}

function checkIfHasMessageEmitterMetadata(innerDocument) {
  const { metadata } = innerDocument
  return metadata && metadata['#messageEmitter'] && metadata['#messageEmitter'] === 'externalMessages'
}

function checkIfIsExternalMessageType(innerDocument) {
  return innerDocument.type === MessageTypesConstants.BLIP_EXTERNAL
}

export {
  checkIsExternalMessage
}
