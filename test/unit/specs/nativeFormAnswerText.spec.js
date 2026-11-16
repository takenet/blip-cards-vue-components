// Text of the answer bubble sent with `on-selected`: one "label: value" line per field.
import { renderVNode } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'
import { linkify, previewText } from '../../../src/utils/misc'

describe('NativeForm - answer text', () => {
  it('writes one line per field, with "—" for empty optional fields and file names as links', () => {
    const sent = []
    const { vm } = renderVNode(NativeForm, {
      document: {
        validation: {
          fields: [
            { id: 'nome', label: 'Nome completo', type: 'text', required: true, value: 'Maria da Silva' },
            { id: 'motivo', label: 'Motivo do contato', type: 'select', value: 'falta', options: [{ value: 'falta', label: 'Falta de energia' }] },
            { id: 'canais', label: 'Canais', type: 'checkbox', value: ['sms', 'email'], options: [{ value: 'email', label: 'E-mail' }, { value: 'sms', label: 'SMS' }] },
            { id: 'referencia', label: 'Ponto de referência (opcional)', type: 'text' },
            { id: 'conta', label: 'Conta', type: 'file' }
          ]
        }
      },
      onUploadFile: () => Promise.resolve('https://media.example/conta'),
      onSelected: (summary, message) => sent.push({ summary, content: message.content })
    })
    // Not mounted: submit only checks that the form exists
    vm.$refs.form = {}
    vm.formValues.conta = 'https://media.example/conta'
    vm.uploads.conta = { status: 'done', fileName: 'conta.pdf', message: '', token: 1, items: [], notice: '' }

    vm.submit()

    expect(sent[0].summary).to.equal([
      'Nome completo: Maria da Silva',
      'Motivo do contato: Falta de energia',
      'Canais: E-mail, SMS',
      'Ponto de referência (opcional): —',
      'Conta: [conta.pdf](https://media.example/conta)'
    ].join('\n'))
    // The bot still receives the empty value
    expect(sent[0].content.referencia).to.equal('')
    // The plain text card keeps the line breaks (its bubble uses `white-space: pre-line`)
    expect(linkify(sent[0].summary).split('\n')).to.have.length(5)
  })

  it('keeps one line per field for multi-line text, blank text and several signed file links', () => {
    const signed = (name) => `https://media.example/${name}?se=2026-11-16T14%3A11%3A00Z&sig=abc`
    const sent = []
    const { vm } = renderVNode(NativeForm, {
      document: {
        validation: {
          fields: [
            { id: 'descricao', label: 'Descrição', type: 'textarea', value: 'Poste caído\nNº da UC: 999' },
            { id: 'complemento', label: 'Complemento', type: 'text' },
            { id: 'docs', label: 'Comprovantes', type: 'file', multiple: true }
          ]
        }
      },
      onUploadFile: () => Promise.resolve(''),
      onSelected: (summary) => sent.push(summary)
    })
    vm.$refs.form = {}
    vm.formValues.complemento = '   '
    vm.uploads.docs = Object.assign({}, vm.uploads.docs, {
      items: [
        { key: 1, fileName: 'a.pdf', status: 'done', uri: signed('a.pdf') },
        { key: 2, fileName: 'b.pdf', status: 'done', uri: signed('b.pdf') }
      ]
    })
    // The read-only summary of the card also shows the dash for the blank field
    expect(vm.isEmptySummaryValue(vm.formFields[1])).to.equal(true)

    vm.submit()

    const lines = sent[0].split('\n')
    expect(lines).to.deep.equal([
      'Descrição: Poste caído / Nº da UC: 999',
      'Complemento: —',
      `Comprovantes: [a.pdf](${signed('a.pdf')}), [b.pdf](${signed('b.pdf')})`
    ])
    // Each file is a named link and the collapsed preview never cuts one in half
    const html = linkify(sent[0])
    expect(html.split('\n')).to.have.length(3)
    expect(html.match(/<a [^>]*>a\.pdf<\/a>/)).to.not.equal(null)
    expect(html.match(/<a [^>]*>b\.pdf<\/a>/)).to.not.equal(null)
    const preview = previewText(sent[0], 70)
    expect(preview.hasPreview).to.equal(true)
    expect(preview.text.indexOf('[b.pdf](')).to.equal(-1)
  })
})
