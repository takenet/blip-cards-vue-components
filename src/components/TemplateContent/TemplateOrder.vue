<template>
  <div v-if="!isEditing" class="blip-container template-order">
    <div :class="isFailedMessage(status, position)">
      <div :class="'bubble ' + position">
        <bds-button-icon
          v-if="deletable && !isEditing"
          class="editIco trashIco icon-margin"
          icon="trash"
          variant="delete"
          size="short"
          v-on:click="trash(document)"
        ></bds-button-icon>
        <bds-button-icon
          v-if="editable && !isEditing"
          class="editIco icon-margin"
          icon="edit"
          variant="primary"
          size="short"
          v-on:click="toggleEdit"
        ></bds-button-icon>

        <!-- Header Section -->
        <bds-grid v-if="hasDocumentHeader" direction="column" padding="x-2">
          <bds-paper
            elevation="static"
            class="payment-template-order__paper-document"
          >
            <bds-grid
              padding="1"
              direction="row"
              gap="1"
              justify-content="flex-start"
              align-items="center"
            >
              <bds-icon
                theme="outline"
                name="file-pdf"
                size="small"
                type="icon"
                class="icon-pdf"
              ></bds-icon>
              <bds-typo variant="fs-10" bold="bold" line-height="small">
                {{ documentName }}
              </bds-typo>
            </bds-grid>
          </bds-paper>
        </bds-grid>

        <!-- Main Content -->
        <bds-grid direction="column" padding="2">
          <bds-paper
            elevation="static"
            class="mt-card__payment-block__paper-content"
          >
            <bds-grid padding="2" direction="column">
              <bds-typo variant="fs-10">{{ orderTitle }}</bds-typo>
              <div class="divider" />

              <!-- Items -->
              <bds-grid
                v-if="itemsDisplay.single"
                justify-content="flex-start"
                align-items="center"
                direction="row"
                gap="1"
              >
                <img
                  v-if="hasImageHeader"
                  :src="headerImageUrl"
                  alt="item"
                  width="40"
                  class="image-payment"
                />
                <div>
                  <bds-typo variant="fs-12" bold="bold">{{
                    itemsDisplay.name
                  }}</bds-typo>
                  <bds-typo variant="fs-10" class="content-color-ghost">{{
                    formatQuantity(itemsDisplay.quantity)
                  }}</bds-typo>
                </div>
              </bds-grid>

              <bds-grid
                v-else
                justify-content="flex-start"
                align-items="center"
                direction="row"
                gap="1"
              >
                <img
                  v-if="hasImageHeader"
                  :src="headerImageUrl"
                  alt="items"
                  width="40"
                  class="image-payment"
                />
                <div>
                  <bds-typo variant="fs-12" bold="bold">{{
                    itemsDisplay.names
                  }}</bds-typo>
                  <bds-typo variant="fs-10" class="content-color-ghost">{{
                    formatItemsCount(itemsDisplay.totalItems)
                  }}</bds-typo>
                </div>
              </bds-grid>

              <div class="divider" />

              <!-- Payment Methods -->
              <bds-grid justify-content="space-between" align-items="center">
                <bds-typo variant="fs-12" bold="bold">{{
                  paymentMethodsLabel
                }}</bds-typo>
                <div>
                  <bds-icon
                    v-for="icon in paymentIcons"
                    :key="icon"
                    class="content-color-ghost"
                    :theme="getIconTheme(icon)"
                    :name="icon"
                    size="small"
                  ></bds-icon>
                </div>
              </bds-grid>

              <div class="divider" />

              <!-- Total -->
              <bds-grid justify-content="space-between" align-items="center">
                <bds-typo variant="fs-12">Total</bds-typo>
                <bds-typo variant="fs-12" bold="bold">{{
                  formattedTotal
                }}</bds-typo>
              </bds-grid>
            </bds-grid>
          </bds-paper>
        </bds-grid>
        <!-- Text Content -->
        <bds-grid direction="column" gap="1" padding="x-2">
          <!-- Header Text -->
          <bds-grid
            v-if="hasTextHeader"
            justify-content="space-between"
            align-items="center"
          >
            <bds-typo variant="fs-14" bold="bold">{{ headerText }}</bds-typo>
          </bds-grid>

          <!-- Body Text -->
          <bds-grid justify-content="space-between" align-items="center">
            <bds-typo variant="fs-14" style="white-space: pre-line;">{{
              bodyText
            }}</bds-typo>
          </bds-grid>

          <!-- Footer Text -->
          <bds-grid
            v-if="footerText"
            justify-content="space-between"
            align-items="center"
          >
            <bds-typo variant="fs-12" class="color-footer-disable">{{
              footerText
            }}</bds-typo>
          </bds-grid>
        </bds-grid>

        <div class="divider" />
        <!-- Payment Action Buttons -->
        <bds-grid padding="x-2" gap="1" direction="column">
          <bds-grid
            v-for="button in paymentButtons"
            :key="button.type"
            direction="row"
            align-items="center"
            justify-content="center"
            class="button-container payment-button"
            gap="1"
            @click="handlePaymentAction(button)"
          >
            <bds-icon
              :name="button.icon"
              :class="
                'button-container-text-' +
                  (position == 'right' ? 'white' : 'primary')
              "
            ></bds-icon>
            <bds-typo
              :class="
                'button-container-text-' +
                  (position == 'right' ? 'white' : 'primary')
              "
              >{{ button.text }}</bds-typo
            >
          </bds-grid>
        </bds-grid>
      </div>
    </div>
  </div>
</template>

<script>
import { default as base } from '../../mixins/baseComponent.js'
import { isFailedMessage } from '../../utils/misc'
import { TemplateOrderType, TemplateOrderPaymentType, TemplateOrderIcon } from '../../enums/templateOrder.enum.js'

export default {
  name: 'template-order',
  mixins: [base],
  props: {
    status: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'right'
    }
  },
  data: function() {
    return {
      headerText: '',
      bodyText: '',
      footerText: '',
      isFailedMessage
    }
  },
  computed: {
    templateComponents() {
      return (
        (this.document &&
          this.document.template &&
          this.document.template.components) ||
        []
      )
    },
    templateContentComponents() {
      return (
        (this.document &&
          this.document.templateContent &&
          this.document.templateContent.components) ||
        []
      )
    },
    headerComponent() {
      return this.templateComponents.find((comp) => comp.type === TemplateOrderType.HEADER)
    },
    headerContentComponent() {
      return this.templateContentComponents.find(
        (comp) => comp.type === TemplateOrderType.HEADER_UPPER
      )
    },
    bodyComponent() {
      return this.templateComponents.find((comp) => comp.type === TemplateOrderType.BODY)
    },
    bodyContentComponent() {
      return this.templateContentComponents.find((comp) => comp.type === TemplateOrderType.BODY_UPPER)
    },
    footerComponent() {
      return this.templateComponents.find((comp) => comp.type === TemplateOrderType.FOOTER)
    },
    footerContentComponent() {
      return this.templateContentComponents.find(
        (comp) => comp.type === TemplateOrderType.FOOTER_UPPER
      )
    },
    buttonComponent() {
      return this.templateComponents.find(
        (comp) => comp.type === TemplateOrderType.BUTTON && comp.sub_type === TemplateOrderType.ORDER_DETAILS
      )
    },

    hasTextHeader() {
      return this.headerComponent && this.headerComponent.format === TemplateOrderType.TEXT
    },
    hasImageHeader() {
      return (
        this.headerComponent &&
        this.headerComponent.parameters &&
        this.headerComponent.parameters[0] &&
        this.headerComponent.parameters[0].type === TemplateOrderType.IMAGE &&
        this.headerComponent.parameters[0].image &&
        this.headerComponent.parameters[0].image.link
      )
    },
    hasDocumentHeader() {
      return (
        this.headerComponent &&
        this.headerComponent.parameters &&
        this.headerComponent.parameters[0] &&
        this.headerComponent.parameters[0].type === TemplateOrderType.DOCUMENT
      )
    },
    headerImageUrl() {
      if (
        this.hasImageHeader &&
        this.headerComponent.parameters &&
        this.headerComponent.parameters[0]
      ) {
        return (
          (this.headerComponent.parameters[0].image &&
            this.headerComponent.parameters[0].image.link) ||
          'https://via.placeholder.com/40'
        )
      }
      return 'https://via.placeholder.com/40'
    },
    documentName() {
      if (
        this.hasDocumentHeader &&
        this.headerComponent.parameters &&
        this.headerComponent.parameters[0]
      ) {
        return (
          (this.headerComponent.parameters[0].document &&
            this.headerComponent.parameters[0].document.filename) ||
          'Documento'
        )
      }
      return 'Documento'
    },

    orderDetails() {
      return (
        (this.buttonComponent &&
          this.buttonComponent.parameters &&
          this.buttonComponent.parameters[0] &&
          this.buttonComponent.parameters[0].action &&
          this.buttonComponent.parameters[0].action.order_details) ||
        {}
      )
    },
    orderItems() {
      const items =
        (this.orderDetails.order && this.orderDetails.order.items) || []
      return items.length > 0 ? items : [{ name: 'Item exemplo', quantity: 1 }]
    },
    itemsDisplay() {
      const items = this.orderItems
      if (items.length === 1) {
        const itemName = items[0].name
        return {
          single: true,
          name:
            itemName.length > 40 ? itemName.substring(0, 40) + '...' : itemName,
          quantity: items[0].quantity
        }
      } else {
        const allNames = items.map((item) => item.name).join(', ')
        return {
          single: false,
          names:
            allNames.length > 40 ? allNames.substring(0, 40) + '...' : allNames,
          totalItems: items.length
        }
      }
    },
    orderTitle() {
      const referenceId = this.orderDetails.reference_id || '000000'
      return `Número da cobrança: ${referenceId}`
    },
    formattedTotal() {
      const total = this.orderDetails.total_amount
      if (total) {
        const value = total.value / (total.offset || 100)
        return `R$ ${value.toFixed(2).replace('.', ',')}`
      }
      return 'R$ 0,00'
    },
    paymentIcons() {
      const settings = this.orderDetails.payment_settings || []
      const icons = []

      settings.forEach((setting) => {
        switch (setting.type) {
          case TemplateOrderPaymentType.PIX_DYNAMIC_CODE:
            icons.push(TemplateOrderIcon.PIX)
            break
          case TemplateOrderPaymentType.BOLETO:
            icons.push(TemplateOrderIcon.BARCODE)
            break
          case TemplateOrderPaymentType.PAYMENT_LINK:
            icons.push(TemplateOrderIcon.PAYMENT_CARD)
            break
        }
      })

      return icons.length > 0 ? icons : [TemplateOrderIcon.PIX, TemplateOrderIcon.BARCODE, TemplateOrderIcon.PAYMENT_CARD]
    },
    paymentMethodsLabel() {
      return 'Pagar com'
    },
    paymentButtons() {
      const settings = this.orderDetails.payment_settings || []
      const buttons = []

      settings.forEach((setting) => {
        switch (setting.type) {
          case TemplateOrderPaymentType.PIX_DYNAMIC_CODE:
            buttons.push({
              type: TemplateOrderPaymentType.PIX_DYNAMIC_CODE,
              text: 'Copiar Chave Pix',
              icon: TemplateOrderIcon.COPY,
              data: setting.pix_dynamic_code.code
            })
            break
          case TemplateOrderPaymentType.BOLETO:
            buttons.push({
              type: TemplateOrderPaymentType.BOLETO,
              text: 'Copiar Código do Boleto',
              icon: TemplateOrderIcon.COPY,
              data: setting.boleto.barcode
            })
            break
          case TemplateOrderPaymentType.PAYMENT_LINK:
            buttons.push({
              type: TemplateOrderPaymentType.PAYMENT_LINK,
              text: 'Abrir Link de Pagamento',
              icon: TemplateOrderIcon.EXTERNAL_FILE,
              data: setting.payment_link.url
            })
            break
        }
      })

      return buttons
    }
  },
  methods: {
    init: function() {
      if (this.hasTextHeader && this.headerContentComponent) {
        let text = this.headerContentComponent.text || ''

        if (this.headerComponent && this.headerComponent.parameters) {
          this.headerComponent.parameters.forEach((param, index) => {
            const placeholder = `{{${index + 1}}}`
            if (param.type === 'text') {
              const escapedPlaceholder = placeholder.replace(/[{}]/g, '\\$&')
              text = text.replace(
                new RegExp(escapedPlaceholder, 'g'),
                param.text || ''
              )
            }
          })
        }

        this.headerText = this.processText(text)
      }

      if (this.bodyContentComponent) {
        let text = this.bodyContentComponent.text || ''

        if (this.bodyComponent && this.bodyComponent.parameters) {
          this.bodyComponent.parameters.forEach((param, index) => {
            const placeholder = `{{${index + 1}}}`
            if (param.type === 'text') {
              const escapedPlaceholder = placeholder.replace(/[{}]/g, '\\$&')
              text = text.replace(
                new RegExp(escapedPlaceholder, 'g'),
                param.text || ''
              )
            }
          })
        }

        this.bodyText = this.processText(text)
      }

      if (this.footerContentComponent) {
        this.footerText = this.processText(
          this.footerContentComponent.text || ''
        )
      }
    },
    processText: function(text) {
      if (!text) return ''
      return text.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n')
    },
    formatQuantity(quantity) {
      return `Quantidade: ${quantity}`
    },
    formatItemsCount(count) {
      return `${count} ${count === 1 ? 'item' : 'itens'}`
    },
    getIconTheme(iconName) {
      return iconName === 'pix' ? 'solid' : 'outline'
    },
    handlePaymentAction(button) {
      switch (button.type) {
        case 'pix_dynamic_code':
        case 'boleto':
          this.copyToClipboard(button.data, button.text)
          break
        case 'payment_link':
          window.open(button.data, '_blank', 'noopener,noreferrer')
          break
      }
    },
    copyToClipboard(text, buttonText) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
      } else {
        this.fallbackCopyToClipboard(text, buttonText)
      }
    },
    fallbackCopyToClipboard(text, buttonText) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
      } catch (err) {
        console.error('Erro ao copiar:', err)
      }

      document.body.removeChild(textArea)
    },
    orderSave: function($event) {
      if (this.errors.any() || ($event && $event.shiftKey)) {
        return
      }

      this.$validator.validateAll().then((result) => {
        if (!result) return

        if (this.bodyComponent) {
          this.save({
            ...this.bodyComponent,
            text: this.bodyText
          })
        }

        if (this.footerComponent) {
          this.save({
            ...this.footerComponent,
            text: this.footerText
          })
        }
      })
    },
    orderEditCancel: function() {
      this.cancel()
    }
  },
  updated: function() {
    this.$emit('updated')
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.template-order {
  .divider {
    border-top: 1px dashed $color-surface-3;
    margin-top: 8px;
    margin-bottom: 8px;
    width: 100%;
  }

  .payment-button {
    margin: 0;
    &:not(:last-child) {
      border-bottom: 1px solid $color-surface-3;
      border-radius: 0;
    }
  }

  .bubble {
    padding: $bubble-padding;
    padding-left: 0px;
    padding-right: 0px;
    min-width: 210px;
    text-align: left;
    width: 290px;
    max-width: 90%;
  }
}

.payment-template-order__paper-document {
  margin-bottom: -10px !important;
  border-radius: 6px;
  .icon-pdf {
    color: #d32f2f;
  }
}

.mt-card__payment-block__paper-content {
  background-color: $color-surface-2;
  .image-payment {
    border-radius: 4px;
    object-fit: cover;
  }
}

.color-footer-disable {
  color: $color-content-ghost;
}

.content-color-ghost {
  color: $color-content-ghost;
}

.blip-card .form-group .help {
  padding: 0px;
}

.button-container {
  width: 100%;
  padding: 8px 16px;
  cursor: pointer;
}

.button-container-text-primary {
  color: $color-primary;
}

.button-container-text-white {
  color: $color-surface-1;
}
</style>
