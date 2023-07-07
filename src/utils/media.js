export async function tryCreateLocalMediaUri(mediaDocument, asyncFetchMedia) {
  const uri = mediaDocument.uri
  try {
    const result = await asyncFetchMedia(mediaDocument)
    const localUri = URL.createObjectURL(
      new Blob([await result.arrayBuffer()], { type: mediaDocument.type })
    )
    return localUri
  } catch (error) {
    return uri
  }
}
