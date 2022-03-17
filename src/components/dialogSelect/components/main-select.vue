
<template>
  <div class="select_wapper">
    <el-select
      ref="mlpSelect"
      v-model="selectedVal"
      multiple
      filterable
      remote
      popper-class="diy-selectdialog-tag-popper-main-class-hidden"
      :placeholder="placeText"
      @focus="mlpSelFocus"
      @remove-tag="handleRemoveTag"
    >

      <el-option
        v-for="(item,index) in userSelectedData"
        :key="optsKey(item,index)"
        :label="formatterFromParent(item)"
        :value="handleOpsValue(item)"
      />
    </el-select>
    <span
      class="mock_icon"
      @click="()=>{this.$emit('inpGetFocus')}"
    >
      <i class="el-icon-files" />
    </span>
  </div>
</template>>

<script>
import { get as _get } from 'lodash'
import { validatenull } from '../util'

export default {
  props: ['dialogOption', 'echoDictConfig', 'userSelectedData', 'formatterLabel'],

  data() {
    return {
    }
  },
  computed: {
    placeText() {
      let text = _get(this.dialogOption, 'dialogConfig.title', '')
      text = !text ? '请选择' : '请选择' + text
      return text
    },
    selectedVal: {
      get: function() {
        let userSelectedData = this.userSelectedData
        if (validatenull(userSelectedData)) return
        // 逻辑
        let { valueKey } = this.echoDictConfig
        return this.userSelectedData.map(i => i[valueKey])
      },
      set: function(newVal) {
      }
    }

  },
  mounted() {
  },
  methods: {
    optsKey(item, index) {
      let keys = (item[this.echoDictConfig.valueKey] || '') + index
      return keys
    },
    mlpSelFocus() {
      this.$refs.mlpSelect.blur()
      this.$emit('inpGetFocus')
    },
    handleRemoveTag(val) {
      let userD = this.userSelectedData
      let { valueKey } = this.echoDictConfig || ''
      let userSelectedData = userD.filter(i => i[valueKey] !== val)
      this.$emit('updateData', userSelectedData)
    },
    formatterFromParent(item) {
      let result = this.formatterLabel(item)
      return result
    },
    handleOpsValue(item) {
      let val = item[this.echoDictConfig.valueKey]
      return val || ''
    }

  }
}
</script>

<style scoped lang="scss">
.select_wapper {
  .mock_icon {
    position: absolute;
    top: 0;
    width: 25px;
    height: 100%;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i {
      font-size: 18px;
      color: #d3d3d3;
    }
  }
}
</style>

