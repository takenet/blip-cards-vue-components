<template>
  <div v-if="!isEditing" class="blip-container component-order">
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
            class="payment-component-order__paper-document"
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

              <bds-grid justify-content="space-between" align-items="center">
                <bds-typo variant="fs-12">Total</bds-typo>
                <bds-typo variant="fs-12" bold="bold">{{
                  formattedTotal
                }}</bds-typo>
              </bds-grid>
            </bds-grid>
          </bds-paper>
        </bds-grid>
        <bds-grid direction="column" gap="1" padding="x-2">
          <!-- Header Text -->
          <bds-grid
            v-if="hasTextHeader"
            justify-content="space-between"
            align-items="center"
          >
            <bds-typo variant="fs-14" bold="bold">{{ headerText }}</bds-typo>
          </bds-grid>

          <bds-grid justify-content="space-between" align-items="center">
            <bds-typo variant="fs-14" style="white-space: pre-line;">{{
              bodyText
            }}</bds-typo>
          </bds-grid>

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
import { ComponentOrderType, ComponentOrderPaymentType, ComponentOrderIcon } from '../../enums/componentOrder.enum.js'

export default {
  name: 'component-order',
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
    hasTextHeader() {
      return (
        this.document &&
        this.document.interactive &&
        this.document.interactive.header &&
        this.document.interactive.header.type === ComponentOrderType.TEXT
      )
    },
    hasImageHeader() {
      return (
        this.document &&
        this.document.interactive &&
        this.document.interactive.header &&
        this.document.interactive.header.type === ComponentOrderType.IMAGE
      )
    },
    hasDocumentHeader() {
      return (
        this.document &&
        this.document.interactive &&
        this.document.interactive.header &&
        this.document.interactive.header.type === ComponentOrderType.DOCUMENT
      )
    },
    headerImageUrl() {
      return (
        (this.document &&
          this.document.interactive &&
          this.document.interactive.header &&
          this.document.interactive.header.image &&
          this.document.interactive.header.image.link) ||
        'https://placehold.co/50'
      )
    },
    documentName() {
      return (
        (this.document &&
          this.document.interactive &&
          this.document.interactive.header &&
          this.document.interactive.header.document &&
          this.document.interactive.header.document.filename) ||
        'Documento'
      )
    },
    orderItems() {
      const items =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.action &&
          this.document.interactive.action.parameters &&
          this.document.interactive.action.parameters.order &&
          this.document.interactive.action.parameters.order.items) ||
        []
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
      const referenceId =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.action &&
          this.document.interactive.action.parameters &&
          this.document.interactive.action.parameters.reference_id) ||
        '000000'
      return `Número da cobrança: ${referenceId}`
    },
    formattedTotal() {
      const total =
        this.document &&
        this.document.interactive &&
        this.document.interactive.action &&
        this.document.interactive.action.parameters &&
        this.document.interactive.action.parameters.total_amount
      if (total) {
        const value = total.value / (total.offset || 100)
        return `R$ ${value.toFixed(2).replace('.', ',')}`
      }
      return 'R$ 0,00'
    },
    paymentIcons() {
      const settings =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.action &&
          this.document.interactive.action.parameters &&
          this.document.interactive.action.parameters.payment_settings) ||
        []
      const icons = []

      settings.forEach((setting) => {
        switch (setting.type) {
          case ComponentOrderPaymentType.PIX_DYNAMIC_CODE:
            icons.push(ComponentOrderIcon.PIX)
            break
          case ComponentOrderPaymentType.BOLETO:
            icons.push(ComponentOrderIcon.BARCODE)
            break
          case ComponentOrderPaymentType.PAYMENT_LINK:
            icons.push(ComponentOrderIcon.PAYMENT_CARD)
            break
        }
      })

      return icons.length > 0 ? icons : [ComponentOrderIcon.PIX, ComponentOrderIcon.BARCODE, ComponentOrderIcon.PAYMENT_CARD]
    },
    paymentMethodsLabel() {
      return 'Pagar com'
    },
    paymentButtons() {
      const settings =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.action &&
          this.document.interactive.action.parameters &&
          this.document.interactive.action.parameters.payment_settings) ||
        []

      const buttons = []

      settings.forEach((setting) => {
        switch (setting.type) {
          case ComponentOrderPaymentType.PIX_DYNAMIC_CODE:
            buttons.push({
              type: ComponentOrderPaymentType.PIX_DYNAMIC_CODE,
              text: 'Copiar Chave Pix',
              icon: ComponentOrderIcon.COPY,
              data: setting.pix_dynamic_code.code
            })
            break
          case ComponentOrderPaymentType.BOLETO:
            buttons.push({
              type: ComponentOrderPaymentType.BOLETO,
              text: 'Copiar Código do Boleto',
              icon: ComponentOrderIcon.COPY,
              data: setting.boleto.barcode
            })
            break
          case ComponentOrderPaymentType.PAYMENT_LINK:
            buttons.push({
              type: ComponentOrderPaymentType.PAYMENT_LINK,
              text: 'Abrir Link de Pagamento',
              icon: ComponentOrderIcon.EXTERNAL_FILE,
              data: setting.payment_link.url
            })
            break
        }
      })

      return buttons
    },
    actionButtonText() {
      const actionName =
        this.document &&
        this.document.interactive &&
        this.document.interactive.action &&
        this.document.interactive.action.name
      switch (actionName) {
        case 'review_and_pay':
          return 'Revisar e Pagar'
        default:
          return 'Finalizar Pedido'
      }
    }
  },
  methods: {
    processText: function(text) {
      if (!text) return ''
      return text.replace(/\\\\n/g, '\n').replace(/\\n/g, '\n')
    },
    init: function() {
      const rawHeaderText =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.header &&
          this.document.interactive.header.text) ||
        ''
      const rawBodyText =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.body &&
          this.document.interactive.body.text) ||
        ''
      const rawFooterText =
        (this.document &&
          this.document.interactive &&
          this.document.interactive.footer &&
          this.document.interactive.footer.text) ||
        ''
      this.headerText = this.processText(rawHeaderText)
      this.bodyText = this.processText(rawBodyText)
      this.footerText = this.processText(rawFooterText)
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

        if (this.document.interactive.header) {
          this.save({
            ...this.document.interactive.header,
            text: this.headerText
          })
        }

        this.save({
          ...this.document.interactive.body,
          text: this.bodyText
        })

        if (this.document.interactive.footer) {
          this.save({
            ...this.document.interactive.footer,
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

.component-order {
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

.payment-component-order__paper-document {
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
