<template>
  <div class="parameters-content">
    <h1>Parameters</h1>
    <div class="sub-content-column">
      <h3>Editing</h3>
      <div>
        <input type="checkbox" :value="true" v-model="parameters.editable" id="editing-editable" />
        <label for="editing-editable">Editable</label>
      </div>
      <div>
        <input type="checkbox" :value="true" v-model="parameters.deletable" id="editing-deletable" />
        <label for="editing-deletable">Deletable</label>
      </div>
      <div>
        <input type="checkbox" :value="false" v-model="parameters.readonly" id="editing-readonly" />
        <label for="editing-readonly">Readonly</label>
      </div>
      <label style="font-size: smaller; color: #a5a5a5">Readonly property does not apply to all components. Please, checkout the README.md file for more information!</label>
    </div>
    <div class="sub-content-column">
      <h3>Position</h3>
      <div>
        <input type="radio" value="left" v-model="parameters.position" id="position-left" />
        <label for="position-left">Left</label>
      </div>
      <div>
        <input type="radio" value="middle" v-model="parameters.position" id="position-middle" />
        <label for="position-middle">Middle</label>
      </div>
      <div>
        <input type="radio" value="right" v-model="parameters.position" id="position-right" />
        <label for="position-right">Right</label>
      </div>
    </div>
    <div class="sub-content-column">
      <h3>Message Info</h3>
      <div>
        <h5>Date:</h5>
        <input type="text" v-model="parameters.date" />        
      </div>
      <div>
        <input type="radio" :value="true" v-model="parameters.isSample" id="sample-true" />
        <label for="sample-true">Samples</label>
        <input type="radio" :value="false" v-model="parameters.isSample" id="sample-false" />
        <label for="sample-false">JSON</label>
      </div>
      <div>
        <input type="checkbox" value="false" v-model="parameters.photo" id="show-photo" />
        <label for="show-photo">Show Photo</label>
      </div>
      <div>
        <input type="checkbox" value="false" v-model="parameters.group" id="group-messages" />
        <label for="group-messages">Group Messages</label>
      </div>
    </div>
    <div class="sub-content-column">
      <h3>Status notification</h3>
      <div>
        <input type="radio" name="status" v-model="parameters.msgStatus" value="dispatched" checked id="notification-dispatched" />
        <label for="notification-dispatched">Dispatched</label>
      </div>
      <div>
        <input type="radio" name="status" v-model="parameters.msgStatus" value="accepted" checked id="notification-accepted" />
        <label for="notification-accepted">Accepted</label>
      </div>
      <div>
        <input type="radio" name="status" v-model="parameters.msgStatus" value="received" id="notification-received" />
        <label for="notification-received">Received</label>
      </div>
      <div>
        <input type="radio" name="status" v-model="parameters.msgStatus" value="consumed" id="notification-consumed" />
        <label for="notification-consumed">Consumed</label>
      </div>
      <div>
        <input type="radio" name="status" v-model="parameters.msgStatus" value="failed" id="notification-failed" />
        <label for="notification-failed">Failed</label>
      </div>
    </div>
    <div class="sub-content-column">
      <h3>Link rendering:</h3>
      <div>
        <input type="radio" :value="false" v-model="parameters.disableLink" id="disable-link-yes" />
        <label for="disable-link-yes">Yes</label>
      </div>
      <div>
        <input type="radio" :value="true" v-model="parameters.disableLink" id="disable-link-no" />
        <label for="disable-link-no">No</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'parameters',
  props: {
    parameters: {
      type: Object,
      default: {}
    }
  }
}
</script>

<style lang="scss" scoped>
h1, h2, h3, h4, h5 {
  margin: 0;
}

input[type="text"] {
  box-sizing: border-box;
  padding: 8px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #c4c4c4;
}

.parameters-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  > .sub-content-column {
    display: flex;
    flex-direction: column;
  }
}
</style>