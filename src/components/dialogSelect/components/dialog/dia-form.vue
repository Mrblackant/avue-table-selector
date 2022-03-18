<template>
  <avue-form
    ref="dialog-form"
    v-model="searchData"
    :option="columnItemList"
    @reset-change="emptytChange"
    @submit="onSubmit"
  />
</template>

<script>
import { get as _get } from 'lodash'
const basicOpts = {
  submitText: '搜 索'
  // submitBtn: false,
  // emptyBtn: false,
}
export default {
  name: 'BasicDoubleForm',
  inject: ['mian_this'],
  data() {
    return {
      searchData: {} // 例如 : {name: ''}
    }
  },
  computed: {
    columnItemList() { // 处理avuefrom配置格式,返回{x:x,column:[]}
      let formOption = _get(this, 'mian_this.baseOptsFromParent', null)
      if (!formOption) return
      let formConfig = _get(formOption, 'formTableColumnConfig.formConfig', {})
      let formColumn = _get(formOption, 'formTableColumnConfig.column', [])
      return {
        enter: true,
        ...basicOpts,
        ...formConfig,
        column: formColumn
      }
    }
  },
  watch: {
    formOpts() {
    }
  },
  mounted() {
  },
  methods: {

    // 点击搜索按钮的回调函数
    onSubmit(form, done) {
      done()
      this.mian_this.handleFormSearch(form)
    },
    // 点击清空按钮的回调函数
    emptytChange() {
      this.mian_this.handleFormSearch(null)
    }
  }
}
</script>

<style scoped>
</style>
