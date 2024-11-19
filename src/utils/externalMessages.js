import { MessageTypesConstants } from '../utils/MessageTypesConstants.js'

function checkIsExternalMessage(msg) {
  let innerDocument

  if (msg && msg.document) {
    innerDocument = msg.document
  } else {
    innerDocument = msg
  }

  const isExternalMessage = Boolean(
    innerDocument.type === MessageTypesConstants.BLIP_EXTERNAL ||
    (innerDocument &&
    innerDocument.metadata &&
    innerDocument.metadata['#messageEmitter'] &&
    innerDocument.metadata['#messageEmitter'] === 'externalMessages')
  )

  return isExternalMessage
}

export {
  checkIsExternalMessage
}
