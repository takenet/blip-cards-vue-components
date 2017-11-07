<template>
  <div>
    <div class="float" style="width: 150px">
      <div>
        <h1>Width:</h1>
        <input v-model="width" >
      </div>

      <div>
        <h1>Position:</h1>
        <input type="radio" value="left" v-model="position" > LEFT
        <input type="radio" value="right" v-model="position" > RIGHT
      </div>

      <div>
        <h1>Date:</h1>
        <input v-model="date" >
      </div>

      <div style="clear: both">
      </div>

      <h1>JSON:</h1>
      <textarea v-model="json" style="width: 100%; height: 300px;"></textarea>

      <button @click="send">ENVIAR</button>
    </div>

    <div :style="'float: left; width:' + width + 'px; margin: 50px 100px; background-color: #FAF9F8; padding: 20px;'">
      <div v-for="(item, index) in documents">
        <blip-card :position="item.position" :date="item.date" :on-selected="teste" :hide-options="false" :document="item.document" />
      </div>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    send: function () {
      this.documents.push({ document: JSON.parse(this.json), date: this.date, position: this.position })
    }
  },
  data: function () {
    return {
      documents: [],
      json: JSON.stringify({'id': '1', 'to': '128271320123982@messenger.gw.msging.net', 'type': 'text/plain', 'content': 'Seja bem-vindo ao nosso serviço! Como podemos te ajudar?'}),
      width: 1000,
      position: 'left',
      date: '08:32 PM',
      teste: function (text, obj) {
        console.log(text, obj)
      }
    }
  },
  components: {
  }
}
</script>


<style lang="scss">
   .float {
     float: left;
     padding: 20px;
   }
</style>
