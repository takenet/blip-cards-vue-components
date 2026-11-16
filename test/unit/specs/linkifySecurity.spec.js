// Locks that [label](signed media link) anchors can never be reached by the generic URL/www/e-mail
// patterns of linkify (stored XSS: a www link swallowed the file anchor into its href), and that text
// without such links is linkified exactly as before.
import { Parser } from 'htmlparser2'
import { linkify } from '../../../src/utils/misc'

// PlainText runs linkify on the output of the library sanitize mixin in escape mode. The mixin does
// `import * as sanitize from 'sanitize-html'`, which is only callable under webpack; flag the module as
// ES so babel hands the function itself to the mixin, as webpack does.
const loadLibrarySanitize = () => {
  const sanitizeHtml = require('sanitize-html')
  const mixinPath = require.resolve('../../../src/mixins/sanitizeHtml')
  delete require.cache[mixinPath]
  sanitizeHtml.__esModule = true
  try {
    return require(mixinPath).default.mixin
  } finally {
    delete sanitizeHtml.__esModule
    delete require.cache[mixinPath]
  }
}
const sanitize = loadLibrarySanitize()
const escapeSanitize = (text) => sanitize(text, { disallowedTagsMode: 'escape' })

const elements = (html) => {
  const found = []
  const parser = new Parser({ onopentag: (name, attribs) => found.push({ name, attribs }) }, { decodeEntities: true })
  parser.write(html)
  parser.end()
  return found
}

const expectOnlyLinkAttributes = (html) => {
  const found = elements(html)
  found.forEach(({ name, attribs }) => {
    expect(name, html).to.equal('a')
    Object.keys(attribs).forEach(attribute => expect(['href', 'target', 'rel'], html).to.include(attribute))
    expect(attribs.href, html).to.not.match(/[<>]/)
  })
  return found
}

const signed = 'https://hmgmsgingmedia.blob.core.windows.net/media/x/boleto.pdf?sv=2021-08-06&amp;se=2026-11-16T14%3A11%3A00Z&amp;sr=b&amp;sp=r&amp;sig=abc'
const fileAnchor = (label, uri = signed) => `<a href="${uri}" target="_blank" rel="noopener noreferrer">${label}</a>`

// linkify as released with the named media links (13c6bf7), kept as the reference for unchanged output.
function previousLinkify(inputText, disableLink) {
  if (!inputText) {
    return ''
  }
  if (/href\s*=/i.test(inputText)) {
    return inputText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  }
  if (disableLink) {
    return inputText
  }
  // eslint-disable-next-line no-useless-escape
  const urlValidPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim
  const pseudoUrlValidPattern = /(^|[^/])(www\.[\S]+(\b|$))/gim
  const emailAddressValidPattern = /[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim
  const namedMediaLinkPattern = /\[([^[\]\r\n]{1,200})\]\((https?:\/\/[^\s()"'<>]+)\)/g
  const isSignedMediaUri = (uri) => /[?&;]se=/.test(uri) && /[?&;]sig=/.test(uri)
  const anchors = []
  const withNamedLinks = inputText.replace(namedMediaLinkPattern, (match, label, uri) => {
    if (!isSignedMediaUri(uri) || /:\/\/|www\./i.test(label) || /[<>"]/.test(label)) {
      return match
    }
    anchors.push(`<a href="${uri}" target="_blank" rel="noopener noreferrer">${label}</a>`)
    return `\u0001${anchors.length - 1}\u0001`
  })
  return withNamedLinks
    .replace(urlValidPattern, '<a href="$&" target="_blank">$&</a>')
    .replace(pseudoUrlValidPattern, '$1<a href="https://$2" target="_blank">$2</a>')
    .replace(emailAddressValidPattern, '<a href="mailto:$&" target="_blank">$&</a>')
    .replace(/\u0001(\d+)\u0001/g, (match, index) => anchors[Number(index)])
}

describe('linkify security (named media links)', () => {
  const payload = 'www.evil.com[f.pdf](https://h/onmouseover=alert`1`//?se=1&sig=2)z'

  it('reference implementation reproduces the vulnerability (guards this spec)', () => {
    const attributes = elements(previousLinkify(escapeSanitize(payload)))
      .reduce((all, { attribs }) => all.concat(Object.keys(attribs)), [])
    expect(attributes).to.include('onmouseover')
  })

  const variants = {
    raw: payload,
    'after the library sanitize (escape mode)': escapeSanitize(payload)
  }
  Object.keys(variants).forEach(variant => {
    it(`keeps the file anchor out of a www link: ${variant}`, () => {
      const html = linkify(variants[variant])
      const anchors = expectOnlyLinkAttributes(html)
      expect(anchors).to.have.length(2)
      expect(anchors[0].attribs.href).to.equal('https://www.evil.com')
      expect(anchors[0].attribs.href).to.not.include('<a')
      expect(anchors[1].attribs.rel).to.equal('noopener noreferrer')
      expect(html).to.match(/>f\.pdf<\/a>z$/)
    })
  })

  it('www link right before a named link and text after it', () => {
    const text = escapeSanitize('www.x[f](https://h/a?se=1&sig=2)a')
    const html = linkify(text)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="https://www.x" target="_blank">www.x</a>' + fileAnchor('f', 'https://h/a?se=1&amp;sig=2') + 'a'
    )
  })

  it('http link and named link side by side', () => {
    const html = linkify(`http://a.com/x[boleto.pdf](${signed})http://b.com`)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="http://a.com/x" target="_blank">http://a.com/x</a>' +
      fileAnchor('boleto.pdf') +
      '<a href="http://b.com" target="_blank">http://b.com</a>'
    )
  })

  it('e-mail addresses next to a named link', () => {
    const html = linkify(`joe@mail.com[boleto.pdf](${signed})ann@x.com.br`)
    expectOnlyLinkAttributes(html)
    expect(html).to.equal(
      '<a href="mailto:joe@mail.com" target="_blank">joe@mail.com</a>' +
      fileAnchor('boleto.pdf') +
      '<a href="mailto:ann@x.com.br" target="_blank">ann@x.com.br</a>'
    )
  })

  it('quotes in the label or in the address stay inside the anchor', () => {
    const text = '[a" onmouseover=x](https://h/a?se=1&sig=2) [f](https://h/a?se=1&sig=2&quot;onclick=x//)'
    ;[text, escapeSanitize(text)].forEach(variant => {
      const html = linkify(variant)
      expectOnlyLinkAttributes(html)
      expect(html).to.not.include('rel="noopener noreferrer">a')
    })
  })

  // Only the file anchor is checked here.
  it('does not write a file anchor inside a tag', () => {
    const html = linkify(escapeSanitize('<a name="x[f](https://h/a?se=1&sig=2)">hi</a>'))
    expect(html).to.not.include('rel="noopener noreferrer"')
  })

  it('keeps the output of a signed media link', () => {
    const text = `Arquivo: [boleto.pdf](${signed}), [nota fiscal.pdf](${signed})\nObs: <b>ok</b>`
    expect(linkify(text)).to.equal(
      `Arquivo: ${fileAnchor('boleto.pdf')}, ${fileAnchor('nota fiscal.pdf')}\nObs: <b>ok</b>`
    )
    expect(linkify(text)).to.equal(previousLinkify(text))
    expect(linkify(escapeSanitize(text))).to.equal(previousLinkify(escapeSanitize(text)))
  })

  describe('text without named media links is linkified exactly as before', () => {
    const texts = [
      '',
      null,
      undefined,
      'just some text',
      'http://example.com',
      'see https://example.com/path?a=1&b=2#frag, and ftp://files.example.com/x.zip.',
      'www.example.com',
      '(www.example.com/page) and www.other.org.',
      'go to http://www.example.com now',
      'mail joe.doe@example.com or ann-x@sub.example.co.uk',
      'mixed: https://a.com www.b.com c@d.com\nwww.e.com\nhttp://f.com/www.g.com',
      'www.a.comhttps://b.com/x',
      'www.a.com(https://b.com/x)',
      '<b>bold</b> www.example.com <i>http://x.com</i>',
      '<a href="http://x.com">x</a>',
      '[not signed](https://example.com/file.pdf)',
      '[www.label.com](https://h/a?se=1&amp;sig=2)',
      '[a <b>](https://h/a?se=1&amp;sig=2)',
      'é www.ação.com.br ç',
      '\u0001 0 \u0001 www.x.com'
    ]
    texts.forEach(text => {
      it(String(JSON.stringify(text)), () => {
        expect(linkify(text)).to.equal(previousLinkify(text))
        expect(linkify(text, true)).to.equal(previousLinkify(text, true))
        if (typeof text === 'string') {
          const sanitized = escapeSanitize(text)
          expect(linkify(sanitized)).to.equal(previousLinkify(sanitized))
        }
      })
    })
  })
})
