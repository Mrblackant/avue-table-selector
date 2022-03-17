
<template>
  <div>
    <el-input
      id="adadad"
      ref="singleInput"
      :value="value"
      :placeholder="placeText"
      clearable
      @focus="singleInpFocus"
      @clear="removeUser"
    />
  </div>
</template>>

<script>
import { get as _get } from 'lodash'

export default {
  props: ['value', 'dialogOption'],
  data() {
    return {
    }
  },
  computed: {
    placeText() {
      let text = _get(this.dialogOption, 'dialogConfig.title', '')
      text = !text ? '请选择' : '请选择' + text
      return text
    }
  },
  mounted() {
  },
  methods: {
    singleInpFocus() {
      this.$refs.singleInput.blur()
      this.$emit('inpGetFocus')
    },
    removeUser() {
      this.$emit('removeUser')
    }
  }
}
</script>

<style scoped>
</style>

