function getMemberInfo(msg) {
  let innerDocument

  if (msg && msg.document) {
    innerDocument = msg.document
  } else {
    innerDocument = msg
  }

  if (!innerDocument.metadata) {
    return ''
  }

  const memberInfo = String(
    innerDocument.metadata['memberName']
      ? innerDocument.metadata['memberName']
      : innerDocument.metadata['memberPhoneNumber']
  )

  return memberInfo
}

export { getMemberInfo }
