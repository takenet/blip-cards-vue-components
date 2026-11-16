// `file` fields with `multiple: true`: several files in the same field, answered as an array of addresses.
import Vue from 'vue'
import { renderVNode, findAll } from '../helpers/vueSfc'
import NativeForm from '../../../src/components/NativeForm.vue'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const deferred = () => {
  const result = {}
  result.promise = new Promise((resolve, reject) => {
    result.resolve = resolve
    result.reject = reject
  })
  return result
}

const pdf = (name) => ({ name, size: 1024, type: 'application/pdf' })

const createForm = (fields, onUploadFile) => {
  const sent = []
  const { vm } = renderVNode(NativeForm, {
    document: { validation: { fields } },
    onUploadFile,
    onSelected: (summary, message) => sent.push({ summary, content: message.content })
  })
  // Not mounted: submit only checks that the form exists
  vm.$refs.form = {}
  return { vm, sent }
}

const pick = (vm, files, fieldIndex = 0) => {
  const input = { files, value: 'C:\\fakepath\\file' }
  vm.onFilesChange(vm.formFields[fieldIndex], { target: input })
  return input
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

const attrs = (vnode) => (vnode.data && vnode.data.attrs) || {}
const hasClass = (vnode, name) => !!(vnode.data && typeof vnode.data.staticClass === 'string' &&
  vnode.data.staticClass.split(' ').indexOf(name) !== -1)
const textOf = (vnode) => vnode.text !== undefined
  ? vnode.text
  : (vnode.children || []).map(textOf).join('')

// Uploads resolved by the test, one per call, in call order
const controlledUpload = () => {
  const calls = []
  const onUploadFile = (file) => {
    const call = deferred()
    call.file = file
    calls.push(call)
    return call.promise
  }
  return { calls, onUploadFile }
}

describe('NativeForm - several files in the same field', () => {
  let previousDocument

  before(() => {
    // focusField runs after a blocked submit or a removal
    previousDocument = global.document
    global.document = { getElementById: () => null }
  })

  after(() => {
    global.document = previousDocument
  })

  const listField = (overrides) => Object.assign(
    { id: 'comprovantes', label: 'Comprovantes', type: 'file', multiple: true, maxFiles: 5 },
    overrides
  )

  it('sends the addresses in the order the files were picked, even when uploads finish out of order', () => {
    const { calls, onUploadFile } = controlledUpload()
    const { vm, sent } = createForm([listField({ required: true })], onUploadFile)

    const firstInput = pick(vm, [pdf('a.pdf')])
    pick(vm, [pdf('b.pdf')])
    expect(firstInput.value).to.equal('')

    return flush()
      .then(() => {
        expect(calls.map((call) => call.file.name)).to.deep.equal(['a.pdf', 'b.pdf'])
        calls[1].resolve('https://media.example/u2')
        return flush()
      })
      .then(() => {
        calls[0].resolve({ uri: 'https://media.example/u1' })
        return flush()
      })
      .then(() => {
        const vnode = render(vm)
        const input = findAll(vnode, (node) => node.tag === 'input' && attrs(node).type === 'file')[0]
        expect(attrs(input).multiple).to.not.equal(undefined)
        const removeLabels = findAll(vnode, (node) => hasClass(node, 'native-form-file-remove'))
          .map((node) => attrs(node)['aria-label'])
        expect(removeLabels).to.deep.equal(['Remover a.pdf', 'Remover b.pdf'])
        const counter = findAll(vnode, (node) => hasClass(node, 'native-form-file-count'))[0]
        expect(textOf(counter).trim()).to.equal('2 de 5 arquivos')

        vm.submit()
        expect(sent).to.have.length(1)
        expect(sent[0].content.comprovantes).to.deep.equal(['https://media.example/u1', 'https://media.example/u2'])
        expect(sent[0].summary).to.equal('Comprovantes: [a.pdf](https://media.example/u1), [b.pdf](https://media.example/u2)')

        const links = findAll(render(vm), (node) => hasClass(node, 'native-form-file-link'))
        expect(links.map((node) => attrs(node).href)).to.deep.equal(['https://media.example/u1', 'https://media.example/u2'])
      })
  })

  it('keeps only the files that fit the limit, shows a notice and still lets the form be sent', () => {
    const { calls, onUploadFile } = controlledUpload()
    const { vm, sent } = createForm([listField({ maxFiles: 2, errorMessage: 'Custom error' })], onUploadFile)

    pick(vm, [pdf('a.pdf'), pdf('b.pdf'), pdf('c.pdf')])
    expect(vm.fileItems(vm.formFields[0]).map((item) => item.fileName)).to.deep.equal(['a.pdf', 'b.pdf'])
    expect(vm.fileNotice(vm.formFields[0])).to.equal('Você pode enviar no máximo 2 arquivos.')

    return flush().then(() => {
      expect(calls).to.have.length(2)
      calls.forEach((call, index) => call.resolve(`https://media.example/${index}`))
      return flush()
    }).then(() => {
      const vnode = render(vm)
      const input = findAll(vnode, (node) => node.tag === 'input' && attrs(node).type === 'file')[0]
      expect(attrs(input).disabled).to.equal(true)
      expect(findAll(vnode, (node) => hasClass(node, 'native-form-file-button'))).to.have.length(0)

      vm.submit()
      expect(sent).to.have.length(1)
      expect(sent[0].content.comprovantes).to.deep.equal(['https://media.example/0', 'https://media.example/1'])
    })
  })

  it('blocks sending while a file failed until it is removed, and when a required field has no file', () => {
    const onUploadFile = (file) => file.name === 'bad.pdf'
      ? Promise.reject(new Error('network'))
      : Promise.resolve(`https://media.example/${file.name}`)
    const { vm, sent } = createForm([listField({ accept: '.pdf' })], onUploadFile)

    pick(vm, [pdf('ok.pdf'), pdf('bad.pdf'), { name: 'virus.exe', size: 10, type: '' }])
    return flush().then(() => {
      const field = vm.formFields[0]
      expect(vm.fileItems(field).map((item) => item.status)).to.deep.equal(['done', 'error', 'error'])
      expect(vm.fieldErrors.comprovantes.key).to.equal('uploadFailed')
      expect(vm.fieldErrors.comprovantes.message).to.equal('bad.pdf: Não foi possível enviar o arquivo. Tente novamente.')

      vm.submit()
      expect(sent).to.have.length(0)

      vm.removeFile(field, vm.fileItems(field)[1])
      expect(vm.fieldErrors.comprovantes.key).to.equal('fileType')
      vm.removeFile(field, vm.fileItems(field)[1])
      vm.submit()
      expect(sent).to.have.length(1)
      expect(sent[0].content.comprovantes).to.deep.equal(['https://media.example/ok.pdf'])

      const required = createForm([listField({ required: true })], onUploadFile)
      required.vm.submit()
      expect(required.sent).to.have.length(0)
      expect(required.vm.fieldErrors.comprovantes.key).to.equal('required')
    })
  })

  it('keeps sending a single address for a file field without `multiple`', () => {
    const { calls, onUploadFile } = controlledUpload()
    const { vm, sent } = createForm([{ id: 'doc', label: 'Documento', type: 'file' }], onUploadFile)

    const input = findAll(render(vm), (node) => node.tag === 'input' && attrs(node).type === 'file')[0]
    expect(attrs(input).multiple).to.equal(undefined)

    vm.onFileChange(vm.formFields[0], { target: { files: [pdf('a.pdf')], value: 'a.pdf' } })
    return flush().then(() => {
      calls[0].resolve('https://media.example/one')
      return flush()
    }).then(() => {
      vm.submit()
      expect(sent).to.have.length(1)
      expect(sent[0].content.doc).to.equal('https://media.example/one')
      expect(sent[0].summary).to.equal('Documento: [a.pdf](https://media.example/one)')
    })
  })

  it('ignores the result of a file removed while it was uploading', () => {
    const { calls, onUploadFile } = controlledUpload()
    const { vm, sent } = createForm([listField()], onUploadFile)
    const field = vm.formFields[0]

    pick(vm, [pdf('a.pdf')])
    return flush().then(() => {
      vm.removeFile(field, vm.fileItems(field)[0])
      calls[0].resolve('https://media.example/late')
      return flush()
    }).then(() => {
      expect(vm.fileItems(field)).to.have.length(0)
      vm.submit()
      expect(sent).to.have.length(1)
      expect(sent[0].content.comprovantes).to.deep.equal([])
    })
  })

  it('resets the field when `multiple` is turned off on the same id', () => {
    const { calls, onUploadFile } = controlledUpload()
    const { vm } = createForm([listField()], onUploadFile)

    pick(vm, [pdf('a.pdf')])
    return flush()
      .then(() => {
        calls[0].resolve('https://media.example/a')
        return flush()
      })
      .then(() => {
        expect(vm.effectiveValue(vm.formFields[0])).to.deep.equal(['https://media.example/a'])
        vm.document = { validation: { fields: [listField({ multiple: false })] } }
        return flush()
      })
      .then(() => {
        const field = vm.formFields[0]
        expect(vm.fileItems(field)).to.have.length(0)
        expect(vm.formValues.comprovantes).to.equal('')
        expect(vm.effectiveValue(field)).to.equal('')
      })
  })
})
