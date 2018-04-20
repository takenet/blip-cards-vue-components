export class MetadataService {
  async fetchMetadata(document, isEditing) {
    let filledDocument
    const urlToFetch = document.uri

    if (!urlToFetch) {
      return
    }

    try {
      if (self.fetch) {
        // Check if browser supports fetch function
        let response = await fetch(
          `https://parsemetadata.azurewebsites.net/?url=${urlToFetch}`,
          { method: 'GET' }
        )
        filledDocument = this.parseMetadata(await response.text())
      } else {
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = async () => {
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            filledDocument = this.parseMetadata(xhttp.responseText)
          }
        }
        xhttp.open(
          'GET',
          `https://parsemetadata.azurewebsites.net/?url=${urlToFetch}`,
          true
        )
        xhttp.send()
      }
    } catch (e) {
      console.log('Error fetching metadata', e, 'Document:', document)
    }

    return filledDocument
  }

  async parseMetadata(content) {
    console.log('content', content)
    const metadata = JSON.parse(content)

    const title = this.decodeHtml(metadata.title)
    const text = this.decodeHtml(metadata.description)
    const imgPreview = metadata.image

    return {
      title,
      text,
      imgPreview
    }
  }

  decodeHtml(encodedText) {
    let textarea = document.createElement('textarea')
    textarea.innerHTML = encodedText
    let decodedText = textarea.value
    decodedText = decodeURIComponent(decodedText.trim())
    return decodedText
  }
}
