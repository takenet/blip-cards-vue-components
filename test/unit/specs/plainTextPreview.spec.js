// Collapsed preview ("Ver mais") of text messages that carry links to uploaded files (form answers).
import { renderVNode } from '../helpers/vueSfc'
import PlainText from '../../../src/components/PlainText.vue'
import { linkify, previewText } from '../../../src/utils/misc'

const signedUri = (name) =>
  `https://hmgmsgingmedia.blob.core.windows.net/media/energisa/${name}` +
  '?sv=2021-08-06&se=2026-11-16T14%3A11%3A00Z&sr=b&sp=r&sig=Xk2fQ9vR7pL0aB3cXk2fQ9vR7pL0aB3cXk2fQ9vR7pL0aB3c'
const fileLink = (name) => `[${name}](${signedUri(name)})`

const oldPreview = (text, length) => ({
  hasPreview: text.length > length,
  text: text.substring(0, length - 3) + '...'
})

// A '[' that is not closed by '](...)' later in the text
const hasPartialLink = (text) => /\[[^\]]*$|\]\([^)]*$/.test(text.replace(/\.\.\.$/, ''))

describe('previewText', () => {
  it('cuts text without links exactly like before', () => {
    const texts = [
      '',
      'short',
      'a'.repeat(532),
      'a'.repeat(533),
      'Nome: Maria, Comentário: ' + 'texto longo '.repeat(80),
      'veja https://example.com/' + 'x'.repeat(600)
    ]
    texts.forEach((text) => {
      expect(previewText(text, 532)).to.deep.equal(oldPreview(text, 532))
      expect(previewText(text, 40)).to.deep.equal(oldPreview(text, 40))
    })
  })

  it('counts only the file names, so short answers with long signed links are not collapsed', () => {
    const text = 'Comprovantes de pagamento: ' +
      [fileLink('boleto-outubro.pdf'), fileLink('pix-novembro.jpg'), fileLink('recibo-dezembro.pdf')].join(', ') +
      ', Comprovante de posse do imóvel: ' + fileLink('contrato.pdf')

    expect(text.length).to.be.above(532)
    const preview = previewText(text, 532)
    expect(preview.hasPreview).to.equal(false)
  })

  it('never cuts inside a file link', () => {
    const links = ['boleto-outubro.pdf', 'pix-novembro.jpg', 'recibo-dezembro.pdf', 'contrato.pdf']
    const text = 'Descrição: ' + 'x'.repeat(480) + ', Comprovantes: ' + links.map(fileLink).join(', ')

    // Every possible cut point, including ones that fall inside the label or the address of a link
    for (let length = 4; length <= 620; length++) {
      const preview = previewText(text, length)
      expect(preview.text.endsWith('...')).to.equal(true)
      expect(hasPartialLink(preview.text), `length ${length}: ${preview.text.slice(-80)}`).to.equal(false)
      expect(text.startsWith(preview.text.slice(0, -3))).to.equal(true)

      const rendered = linkify(preview.text)
      expect(rendered).to.not.contain('](')
    }
  })

  it('includes a link that fits and stops before one that does not', () => {
    const text = 'abc ' + fileLink('a.pdf') + ' ' + fileLink('long-name.pdf') + ' end'
    // visible: 'abc a.pdf long-name.pdf end' (27 chars)
    expect(previewText(text, 27).hasPreview).to.equal(false)
    expect(previewText(text, 26).hasPreview).to.equal(true)

    // 13 visible chars: 'abc a.pdf ' (10) fits, 'long-name.pdf' (13) does not
    expect(previewText(text, 16)).to.deep.equal({
      hasPreview: true,
      text: 'abc ' + fileLink('a.pdf') + ' ...'
    })
    // 'abc ' (4) fits, 'a.pdf' (5) does not
    expect(previewText(text, 11)).to.deep.equal({ hasPreview: true, text: 'abc ...' })
    // 'abc a.pdf long-name.pdf' (23) fits exactly
    expect(previewText(text, 26).text).to.equal('abc ' + fileLink('a.pdf') + ' ' + fileLink('long-name.pdf') + '...')
    // the text after the links is still cut by characters
    expect(previewText(text, 28).text).to.equal('abc ' + fileLink('a.pdf') + ' ' + fileLink('long-name.pdf') + ' e...')
  })

  it('counts links that are not shown as a file name by their full text, as before', () => {
    const unsigned = 'Site: [x](https://example.com/a) ' + 'y'.repeat(560)
    expect(previewText(unsigned, 532)).to.deep.equal(oldPreview(unsigned, 532))

    const withUrlLabel = '[https://evil.example](' + signedUri('a.pdf') + ') ' + 'y'.repeat(560)
    expect(previewText(withUrlLabel, 100)).to.deep.equal(oldPreview(withUrlLabel, 100))
  })

  it('counts the full text when linkify does not render links', () => {
    const text = fileLink('a.pdf') + ' ' + 'y'.repeat(300)
    expect(previewText(text, 200, true)).to.deep.equal(oldPreview(text, 200))

    const withAnchor = '<a href="https://example.com">x</a> ' + text
    expect(previewText(withAnchor, 200)).to.deep.equal(oldPreview(withAnchor, 200))
  })
})

describe('PlainText preview', () => {
  it('renders whole file links in the collapsed preview', () => {
    const names = ['boleto-outubro.pdf', 'pix-novembro.jpg', 'recibo-dezembro.pdf', 'contrato.pdf']
    const document = 'Observações: ' + 'texto '.repeat(80) + 'Comprovantes: ' + names.map(fileLink).join(', ')
    const { vm } = renderVNode(PlainText, { document })

    const { hasPreview, previewContent } = vm.previewDocument
    expect(hasPreview).to.equal(true)
    expect(previewContent).to.not.contain('](')
    expect(previewContent).to.contain('>boleto-outubro.pdf</a>')
    expect(previewContent.endsWith('...')).to.equal(true)
  })

  it('does not collapse a short answer with long file links', () => {
    const document = 'Comprovantes: ' + ['a.pdf', 'b.pdf', 'c.pdf', 'd.pdf'].map(fileLink).join(', ')
    const { vm } = renderVNode(PlainText, { document })
    expect(document.length).to.be.above(532)
    expect(vm.previewDocument.hasPreview).to.equal(false)
  })
})
