const ComponentOrderType = Object.freeze({
  HEADER: 'header',
  BODY: 'body',
  FOOTER: 'footer',
  IMAGE: 'image',
  DOCUMENT: 'document',
  TEXT: 'text'
})

const ComponentOrderPaymentType = Object.freeze({
  PIX_DYNAMIC_CODE: 'pix_dynamic_code',
  BOLETO: 'boleto',
  PAYMENT_LINK: 'payment_link'
})

const ComponentOrderIcon = Object.freeze({
  PIX: 'pix',
  BARCODE: 'barcode',
  PAYMENT_CARD: 'payment-card',
  COPY: 'copy',
  EXTERNAL_FILE: 'external-file'
})

export { ComponentOrderType, ComponentOrderPaymentType, ComponentOrderIcon }
