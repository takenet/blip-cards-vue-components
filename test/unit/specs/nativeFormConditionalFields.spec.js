// Fields with `showWhen`: shown (and validated) only when another field holds one of the given values.
import Vue from 'vue'
import { renderVNode, findAll } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const createForm = (validation, onUploadFile) => {
  const sent = []
  const { vm } = renderVNode(NativeForm, {
    document: { validation },
    onUploadFile,
    onSelected: (summary, message) => sent.push({ summary, content: message.content })
  })
  // Not mounted: submit only checks that the form exists
  vm.$refs.form = {}
  return { vm, sent }
}

const render = (vm) => {
  const previousIgnored = Vue.config.ignoredElements
  Vue.config.ignoredElements = [/-/]
  try {
    return vm._render()
  } finally {
    Vue.config.ignoredElements = previousIgnored
  }
}

const hasClass = (vnode, name) => !!(vnode.data && typeof vnode.data.staticClass === 'string' &&
  vnode.data.staticClass.split(' ').indexOf(name) !== -1)
const textOf = (vnode) => vnode.text !== undefined
  ? vnode.text
  : (vnode.children || []).map(textOf).join('')
const findByClass = (vm, name) => findAll(render(vm), (node) => hasClass(node, name))

const renderedIds = (vm) => vm.currentFields.map((field) => field.id)
const stepCountText = (vm) => {
  const counter = findByClass(vm, 'native-form-step-count')[0]
  return counter ? textOf(counter).trim() : ''
}
// Waits for the step-change guard against double clicks
const afterGuard = (vm) => { vm.lastStepChangeAt = 0 }

const maritalStatus = {
  id: 'estado_civil',
  label: 'Estado civil',
  type: 'select',
  required: true,
  options: [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'uniao_estavel', label: 'União estável' }
  ]
}
const spouseName = {
  id: 'nome_conjuge',
  label: 'Nome do cônjuge',
  type: 'text',
  required: true,
  showWhen: { field: 'estado_civil', in: ['casado', 'uniao_estavel'] }
}

describe('NativeForm - conditional fields (showWhen)', () => {
  let previousDocument

  before(() => {
    // focusField runs after a blocked submit
    previousDocument = global.document
    global.document = { getElementById: () => null }
  })

  after(() => {
    global.document = previousDocument
  })

  it('shows the field only for the listed values and sends it empty while hidden', () => {
    const { vm, sent } = createForm({ fields: [maritalStatus, spouseName] })
    expect(renderedIds(vm)).to.deep.equal(['estado_civil'])

    vm.formValues.estado_civil = 'casado'
    expect(renderedIds(vm)).to.deep.equal(['estado_civil', 'nome_conjuge'])
    expect(findAll(render(vm), (node) => hasClass(node, 'form-group'))).to.have.length(2)

    vm.formValues.estado_civil = 'solteiro'
    expect(renderedIds(vm)).to.deep.equal(['estado_civil'])
    expect(vm.fieldErrors.nome_conjuge).to.equal(null)

    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({ estado_civil: 'solteiro', nome_conjuge: '' })
    expect(sent[0].summary).to.equal('Estado civil: Solteiro(a)')
    // Read-only summary shown after sending
    const summaryItems = findByClass(vm, 'native-form-summary-item').map((node) => textOf(node).replace(/\s+/g, ' ').trim())
    expect(summaryItems).to.deep.equal(['Estado civil: Solteiro(a)'])
  })

  it('blocks sending while a visible required conditional field is empty', () => {
    const { vm, sent } = createForm({ fields: [maritalStatus, spouseName] })
    vm.formValues.estado_civil = 'uniao_estavel'

    vm.submit()
    expect(sent).to.have.length(0)
    expect(vm.fieldErrors.nome_conjuge.key).to.equal('required')
    expect(vm.showError(vm.currentFields[1])).to.equal(true)

    vm.formValues.nome_conjuge = 'Maria'
    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content.nome_conjuge).to.equal('Maria')
    expect(sent[0].summary).to.equal('Estado civil: União estável\nNome do cônjuge: Maria')
  })

  it('matches `equals` on a radio source and any selected value of a checkbox source', () => {
    const { vm } = createForm({
      fields: [
        { id: 'orgao', label: 'Órgão expedidor', type: 'radio', options: [{ value: 'ssp', label: 'SSP' }, { value: 'outro', label: 'Outro' }] },
        { id: 'outro_orgao', label: 'Outro órgão', type: 'text', required: true, showWhen: { field: 'orgao', equals: 'outro' } },
        { id: 'servicos', label: 'Serviços', type: 'checkbox', options: [{ value: 1, label: 'Um' }, { value: 2, label: 'Dois' }, { value: 3, label: 'Três' }] },
        { id: 'detalhes', label: 'Detalhes', type: 'text', showWhen: { field: 'servicos', in: ['2', 3] } }
      ]
    })
    expect(renderedIds(vm)).to.deep.equal(['orgao', 'servicos'])

    vm.formValues.orgao = 'outro'
    expect(renderedIds(vm)).to.deep.equal(['orgao', 'outro_orgao', 'servicos'])

    vm.formValues.servicos = [1]
    expect(vm.isFieldVisible(vm.formFields[3])).to.equal(false)
    vm.formValues.servicos = [1, 3]
    expect(renderedIds(vm)).to.deep.equal(['orgao', 'outro_orgao', 'servicos', 'detalhes'])
  })

  it('hides a whole chain when the first field no longer matches', () => {
    const { vm } = createForm({
      fields: [
        { id: 'a', label: 'A', type: 'select', options: [{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }] },
        { id: 'b', label: 'B', type: 'select', showWhen: { field: 'a', equals: 'sim' }, options: [{ value: 'x', label: 'X' }] },
        { id: 'c', label: 'C', type: 'text', showWhen: { field: 'b', equals: 'x' } }
      ]
    })
    vm.formValues.a = 'sim'
    vm.formValues.b = 'x'
    expect(renderedIds(vm)).to.deep.equal(['a', 'b', 'c'])

    vm.formValues.a = 'nao'
    expect(renderedIds(vm)).to.deep.equal(['a'])
  })

  it('keeps the values of a hidden field in memory but sends it empty, `[]` for checkbox and lists of files', () => {
    const { vm, sent } = createForm({
      fields: [
        maritalStatus,
        spouseName,
        { id: 'docs', label: 'Documentos', type: 'checkbox', showWhen: { field: 'estado_civil', equals: 'casado' }, options: [{ value: 'rg', label: 'RG' }] },
        { id: 'anexos', label: 'Anexos', type: 'file', multiple: true, showWhen: { field: 'estado_civil', equals: 'casado' } }
      ]
    }, () => new Promise(() => {}))

    vm.formValues.estado_civil = 'casado'
    vm.formValues.nome_conjuge = 'Maria'
    vm.formValues.docs = ['rg']
    vm.touch(vm.formFields[1])
    // Upload still pending when the field gets hidden: it does not block sending
    vm.onFilesChange(vm.formFields[3], { target: { files: [{ name: 'a.pdf', size: 1, type: 'application/pdf' }], value: 'a' } })
    expect(vm.fieldErrors.anexos.key).to.equal('uploading')

    vm.formValues.estado_civil = 'solteiro'
    return flush().then(() => {
      // Hidden again: its flags are reset, so no error shows when it reappears
      expect(vm.touched.nome_conjuge).to.equal(false)

      vm.formValues.estado_civil = 'casado'
      expect(vm.formValues.nome_conjuge).to.equal('Maria')
      vm.formValues.estado_civil = 'solteiro'

      vm.submit()
      expect(sent).to.have.length(1)
      expect(sent[0].content).to.deep.equal({ estado_civil: 'solteiro', nome_conjuge: '', docs: [], anexos: [] })
    })
  })

  it('ignores invalid conditions and always shows the field', () => {
    const always = (showWhen, id = 'x') => ({ id, label: id, type: 'text', showWhen })
    const { vm } = createForm({
      fields: [
        maritalStatus,
        { id: 'foto', label: 'Foto', type: 'file' },
        always({ field: 'nao_existe', equals: 'casado' }, 'unknown'),
        always({ field: 'self', equals: '' }, 'self'),
        always({ field: 'foto', equals: 'x' }, 'file_source'),
        always({ field: 'estado_civil', in: [] }, 'no_values'),
        always({ field: 'estado_civil', equals: { value: 'casado' } }, 'object_value'),
        always(['estado_civil', 'casado'], 'not_object'),
        always({ field: 'cycle_b', equals: '' }, 'cycle_a'),
        always({ field: 'cycle_a', equals: '' }, 'cycle_b'),
        always({ field: 'cycle_a', equals: 'never' }, 'after_cycle')
      ]
    }, () => Promise.resolve('https://media.example/u1'))

    expect(renderedIds(vm)).to.deep.equal([
      'estado_civil', 'foto', 'unknown', 'self', 'file_source', 'no_values', 'object_value', 'not_object',
      'cycle_a', 'cycle_b'
    ])
  })

  it('skips steps whose fields are all hidden and does not count them', () => {
    const { vm, sent } = createForm({
      steps: [
        { title: 'Titular', fields: [maritalStatus] },
        { title: 'Cônjuge', fields: [spouseName] },
        { title: 'Contato', fields: [{ id: 'email', label: 'E-mail', type: 'email', required: true }] }
      ]
    })
    expect(stepCountText(vm)).to.equal('Etapa 1 de 2')

    vm.formValues.estado_civil = 'solteiro'
    vm.submit()
    expect(vm.currentStepTitle).to.equal('Contato')
    expect(stepCountText(vm)).to.equal('Etapa 2 de 2')
    expect(vm.isLastStep).to.equal(true)
    expect(findByClass(vm, 'native-form-next')).to.have.length(0)

    afterGuard(vm)
    vm.back()
    expect(vm.currentStepTitle).to.equal('Titular')

    vm.formValues.estado_civil = 'casado'
    expect(stepCountText(vm)).to.equal('Etapa 1 de 3')
    afterGuard(vm)
    vm.submit()
    expect(vm.currentStepTitle).to.equal('Cônjuge')
    expect(stepCountText(vm)).to.equal('Etapa 2 de 3')
    expect(vm.isLastStep).to.equal(false)

    vm.formValues.nome_conjuge = 'Maria'
    afterGuard(vm)
    vm.submit()
    vm.formValues.email = 'maria@example.com'
    afterGuard(vm)
    vm.submit()
    expect(sent).to.have.length(1)
    expect(sent[0].content).to.deep.equal({ estado_civil: 'casado', nome_conjuge: 'Maria', email: 'maria@example.com' })
  })

  it('keeps the user on the current step when an earlier step appears', () => {
    const { vm } = createForm({
      steps: [
        { title: 'S0', fields: [{ id: 'x', label: 'X', type: 'text', showWhen: { field: 'src', equals: 'a' } }] },
        { title: 'S1', fields: [{ id: 'src', label: 'Src', type: 'select', options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }] },
        { title: 'S2', fields: [{ id: 'z', label: 'Z', type: 'text' }] }
      ]
    })
    expect(vm.currentStep).to.equal(1)
    expect(stepCountText(vm)).to.equal('Etapa 1 de 2')
    expect(findByClass(vm, 'native-form-back')).to.have.length(0)

    vm.formValues.src = 'a'
    expect(vm.currentStepTitle).to.equal('S1')
    expect(stepCountText(vm)).to.equal('Etapa 2 de 3')

    vm.back()
    expect(vm.currentStepTitle).to.equal('S0')
  })

  it('moves to the next visible step when a document update hides the current one, and stays there', () => {
    const validation = {
      steps: [
        { title: 'S0', fields: [{ id: 'a', label: 'A', type: 'select', options: [{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }] }] },
        { title: 'S1', fields: [{ id: 'b', label: 'B', type: 'text', showWhen: { field: 'a', equals: 'x' } }] },
        { title: 'S2', fields: [{ id: 'c', label: 'C', type: 'text' }] }
      ]
    }
    const { vm } = createForm(validation)
    vm.formValues.a = 'x'
    vm.submit()
    expect(vm.currentStepTitle).to.equal('S1')

    Vue.set(validation.steps[1].fields[0], 'showWhen', { field: 'a', equals: 'y' })
    expect(vm.currentStepTitle).to.equal('S2')
    return flush().then(() => {
      expect(vm.currentStep).to.equal(2)
      Vue.set(validation.steps[1].fields[0], 'showWhen', { field: 'a', equals: 'x' })
      expect(vm.currentStepTitle).to.equal('S2')
      expect(stepCountText(vm)).to.equal('Etapa 3 de 3')
    })
  })

  it('never goes back to a hidden step on the final check and sends its invalid value empty', () => {
    const { vm, sent } = createForm({
      steps: [
        { title: 'Titular', fields: [maritalStatus] },
        { title: 'Cônjuge', fields: [Object.assign({}, spouseName, { minLength: 3 })] },
        { title: 'Contato', fields: [{ id: 'email', label: 'E-mail', type: 'email', required: true }] }
      ]
    })
    vm.formValues.estado_civil = 'solteiro'
    vm.formValues.nome_conjuge = 'ab'
    vm.submit()
    vm.formValues.email = 'maria@example.com'
    afterGuard(vm)
    vm.submit()
    expect(vm.currentStepTitle).to.equal('Contato')
    expect(sent).to.have.length(1)
    expect(sent[0].content.nome_conjuge).to.equal('')
  })

  it('resets `attempted` when a field gets hidden', () => {
    const { vm } = createForm({ fields: [maritalStatus, spouseName] })
    vm.formValues.estado_civil = 'casado'
    vm.submit()
    expect(vm.attempted.nome_conjuge).to.equal(true)

    vm.formValues.estado_civil = 'solteiro'
    return flush().then(() => {
      expect(vm.attempted.nome_conjuge).to.equal(false)
      expect(vm.touched.nome_conjuge).to.equal(false)
      vm.formValues.estado_civil = 'casado'
      expect(vm.showError(vm.currentFields[1])).to.equal(false)
    })
  })

  it('uses only the condition of the first field when ids are duplicated', () => {
    const { vm } = createForm({
      fields: [
        maritalStatus,
        { id: 'dup', label: 'Primeiro', type: 'text' },
        { id: 'dup', label: 'Segundo', type: 'text', showWhen: { field: 'estado_civil', equals: 'casado' } }
      ]
    })
    expect(vm.currentFields.map((field) => field.label)).to.deep.equal(['Estado civil', 'Primeiro', 'Segundo'])
  })

  it('keeps only string, number and boolean values of `in`, falling back to `equals`', () => {
    const conditional = (id, showWhen) => ({ id, label: id, type: 'text', showWhen })
    const { vm } = createForm({
      fields: [
        maritalStatus,
        conditional('filtered', { field: 'estado_civil', in: [null, { v: 1 }, 'casado'] }),
        conditional('fallback', { field: 'estado_civil', in: [null], equals: 'casado' }),
        conditional('invalid', { field: 'estado_civil', in: [null, ['casado']] })
      ]
    })
    expect(renderedIds(vm)).to.deep.equal(['estado_civil', 'invalid'])
    vm.formValues.estado_civil = 'casado'
    expect(renderedIds(vm)).to.deep.equal(['estado_civil', 'filtered', 'fallback', 'invalid'])
  })

  it('starts waiting files of visible fields before the ones of hidden fields', () => {
    const calls = []
    const onUploadFile = (file) => new Promise((resolve) => calls.push({ file, resolve }))
    const { vm } = createForm({
      fields: [
        maritalStatus,
        { id: 'visivel', label: 'Visível', type: 'file', multiple: true },
        { id: 'oculto', label: 'Oculto', type: 'file', multiple: true, showWhen: { field: 'estado_civil', equals: 'casado' } }
      ]
    }, onUploadFile)
    const pdf = (name) => ({ name, size: 1, type: 'application/pdf' })
    const pickFiles = (fieldIndex, files) => vm.onFilesChange(vm.formFields[fieldIndex], { target: { files, value: 'x' } })

    vm.formValues.estado_civil = 'casado'
    pickFiles(2, [pdf('h1.pdf'), pdf('h2.pdf'), pdf('h3.pdf'), pdf('h4.pdf')])
    vm.formValues.estado_civil = 'solteiro'
    pickFiles(1, [pdf('v1.pdf')])

    return flush().then(() => {
      expect(calls.map((call) => call.file.name)).to.deep.equal(['h1.pdf', 'h2.pdf', 'h3.pdf'])
      calls[0].resolve('https://media.example/h1')
      return flush()
    }).then(() => {
      expect(calls.map((call) => call.file.name)).to.deep.equal(['h1.pdf', 'h2.pdf', 'h3.pdf', 'v1.pdf'])
      calls[1].resolve('https://media.example/h2')
      return flush()
    }).then(() => {
      expect(calls.map((call) => call.file.name)).to.deep.equal(['h1.pdf', 'h2.pdf', 'h3.pdf', 'v1.pdf', 'h4.pdf'])
    })
  })
})
