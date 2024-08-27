function getInnerDocument(msg) {
  let innerDocument

  if (msg && msg.document) {
    innerDocument = msg.document
  } else {
    innerDocument = msg
  }

  return innerDocument
}

function getMemberInfo(msg) {
  const innerDocument = getInnerDocument(msg)

  if (!innerDocument || !innerDocument.metadata) {
    return ''
  }

  const memberInfo = innerDocument.metadata.memberName
    ? innerDocument.metadata.memberName
    : innerDocument.metadata.memberPhoneNumber

  return memberInfo || ''
}

function getMemberPhoneNumber(msg) {
  const innerDocument = getInnerDocument(msg)

  if (!innerDocument || !innerDocument.metadata) {
    return ''
  }

  return innerDocument.metadata.memberPhoneNumber || ''
}

export { getMemberInfo, getMemberPhoneNumber }
