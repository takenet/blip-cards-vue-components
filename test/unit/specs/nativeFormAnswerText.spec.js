// Text of the answer bubble sent with `on-selected`: one "label: value" line per field.
import { renderVNode } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'
import { linkify } from '../../../src/utils/misc'

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
})
