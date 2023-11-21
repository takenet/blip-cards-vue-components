export async function tryCreateLocalMediaUri(mediaDocument, asyncFetchMedia) {
  const uri = mediaDocument.uri
  try {
    const result = await asyncFetchMedia(mediaDocument)
    const localUri = URL.createObjectURL(
      new Blob([await result.arrayBuffer()], { type: mediaDocument.type })
    )

    if (!localUri) {
      return uri
    }

    return localUri
  } catch (error) {
    return uri
  }
}

export function isAuthenticatedMediaLink(document) {
  return (
    document.authorizationRealm &&
    document.authorizationRealm === 'blip'
  )
}
