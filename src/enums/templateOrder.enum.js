const TemplateOrderType = Object.freeze({
  HEADER: 'header',
  BODY: 'body',
  FOOTER: 'footer',
  BUTTON: 'button',
  ORDER_DETAILS: 'order_details',
  IMAGE: 'image',
  DOCUMENT: 'document',
  TEXT: 'text',
  BUTTONS: 'BUTTONS',
  BODY_UPPER: 'BODY',
  HEADER_UPPER: 'HEADER',
  FOOTER_UPPER: 'FOOTER',
  ORDER_DETAILS_UPPER: 'ORDER_DETAILS'
})

const TemplateOrderPaymentType = Object.freeze({
  PIX_DYNAMIC_CODE: 'pix_dynamic_code',
  BOLETO: 'boleto',
  PAYMENT_LINK: 'payment_link'
})

const TemplateOrderIcon = Object.freeze({
  PIX: 'pix',
  BARCODE: 'barcode',
  PAYMENT_CARD: 'payment-card',
  COPY: 'copy',
  EXTERNAL_FILE: 'external-file'
})

export { TemplateOrderType, TemplateOrderPaymentType, TemplateOrderIcon }
