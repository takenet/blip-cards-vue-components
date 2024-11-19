import { MessageTypesConstants } from '../utils/MessageTypesConstants.js'

function checkIsExternalMessage(msg) {
  let innerDocument

  if (msg && msg.document) {
    innerDocument = msg.document
  } else {
    innerDocument = msg
  }

  const isExternalMessage = Boolean(
    CheckIfIsExternalMessageType(innerDocument) || CheckIfHasMessageEmitterMetadata(innerDocument)
  )

  return isExternalMessage
}

function CheckIfHasMessageEmitterMetadata(innerDocument) {
  const { metadata } = innerDocument
  return innerDocument && metadata && metadata['#messageEmitter'] && metadata['#messageEmitter'] === 'externalMessages'
}

function CheckIfIsExternalMessageType(innerDocument) {
  return innerDocument && innerDocument.type === MessageTypesConstants.BLIP_EXTERNAL
}

export {
  checkIsExternalMessage
}
