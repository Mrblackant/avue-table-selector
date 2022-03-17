<template>
  <div class="dia_select_main_wapper">
    <!-- 表格配置项中为单选的时候显示输入框 -->
    <template v-if="sigleSelect">
      <main-input
        :value="selectVal"
        :dialog-option="dialogOption"
        @inpGetFocus="inpGetFocus"
        @removeUser="removeUser"
      />
    </template>
    <template v-else>
      <main-select
        :echo-dict-config="echoDictConfig"
        :user-selected-data="userSelectedData"
        :formatter-label="formatterFromParent"
        @inpGetFocus="inpGetFocus"
        @updateData="(val)=>{userSelectedData=val}"
      />
    </template>

    <!-- 真正的弹出框 -->
    <dia-log
      :visible.sync="dialogVisible"
      @handleTableRef="(ref)=>{tableRef = ref}"
      @updateData="(val)=>{userSelectedData=val}"
    />

  </div>
</template>

<script>
import { get as _get, filter as _filter, cloneDeep } from 'lodash'
import mainInput from './components/main-input'
import mainSelect from './components/main-select'
import diaLog from './components/dialog'

import { utilProp, utilHandleInitProp, utilHasProto, validatenull } from './util'
import './style/index.scss'

let basicPageConfig = { // 分页器的配置项
  pageSizeList: [10, 20, 30],
  pageSize: 10,
  currentPage: 1,
  total: 0
}

export default {
  name: 'DialogSelectMain',
  provide() {
    return {
      mian_this: this
    }
  },
  components: {
    diaLog,
    mainInput,
    mainSelect
  },
  model: { // v-model的值,prop可以自定义，跟props里对应上即可
    prop: 'formModelVal',
    event: 'formModelInput'
  },
  props: {
    dynamicScope: null,
    formModelVal: null,
    dialogOption: { // 配置项
      type: Object,
      default: () => {
        return utilProp
      }
    }
  },
  data() {
    return {
      formInit: false,
      callBackFlag: true,
      baseOptsFromParent: {}, // 组件基础配置
      dialogVisible: false,
      userSelectedData: undefined, // 选中的所有数据
      formSearchData: {}, // 收集的上方表单用户输入的搜索条件
      tableData: [], // 弹窗-table要展示的数据
      tableRef: {},
      pageConfig: cloneDeep(basicPageConfig)
    }
  },
  computed: {
    echoDictConfig() {
      return this.baseOptsFromParent.tableProps
    },
    selectVal() { // 单选-显示的值
      let result = this.formatterShow(this.userSelectedData)
      return result || ''
    },

    tableRowKey() { // table列key-唯一值
      return _get(this.baseOptsFromParent, 'tableConfig.tableRowKey', 'id')
    },
    sigleSelect() { // table是否单选/多选
      let mode = _get(this.baseOptsFromParent, 'tableConfig.selectMode', '')
      mode = !(mode && mode === 'multiple')
      return mode
    },

    tableColumn() {
      return _get(this.baseOptsFromParent, 'formTableColumnConfig.column', [])
    },
    // 当页唯一字段组成的列表
    tableRowKeyList() {
      let list = []
      this.tableData.forEach(row => {
        list.push(row[this.tableRowKey])
      })
      return list
    }
  },
  watch: {
    formModelVal(newVal) {
      // 组件v-model表单值
      if (validatenull(newVal)) {
        this.userSelectedData = undefined
      } else {//当用户没有自行修改表单时才赋值回显
        if (validatenull(this.userSelectedData)) this.execOnload(undefined, newVal, undefined)
      }
    },
    userSelectedData(newVal) { // 选中值反写
      if (this.callBackFlag) {
        let { change } = this.baseOptsFromParent || {}
        change && change(this.dynamicScope || null, newVal)
        // 给表单赋值
        let result = this.assignForForm(newVal)
        this.$emit('formModelInput', result)
      }
      this.callBackFlag = true
      this.updateSelectedMark()
    }
  },
  created() {
    this.handleCreated()
  },
  mounted() {
  },
  methods: {
    handleCreated() {
      this.initDialogOption()
      if (this.formModelVal) this.execOnload(undefined, this.formModelVal, undefined)
    },
    formatterShow() { // label格式化展示后的内容
      let data = this.userSelectedData && this.userSelectedData.length ? this.userSelectedData[0] : undefined
      // 格式化
      let result = this.formatterFromParent(data)
      return result || ''
    },
    formatterFromParent(targetData) { // 根据父组件的公式做label格式化
      if (!targetData) return undefined
      let { formatter: { labelFormatter } } = this.baseOptsFromParent
      let result = labelFormatter && labelFormatter(targetData) || undefined
      // 兼容处理，即便没传公式也能正常展示label
      let nativeResult = result || _get(targetData, `${this.echoDictConfig.labelKey}`, undefined)

      return nativeResult
    },

    initDialogOption() { // 处理父组件传来的配置，处理默认值
      this.baseOptsFromParent = utilHandleInitProp(this.dialogOption)
    },
    execOnload(page = undefined, value = undefined, data = undefined) { // 处理父组件的onLoad
      let { onLoad } = this.baseOptsFromParent
      if (!onLoad) return
      let { index: $dynamicIndex } = this.dynamicScope || {}
      onLoad({ page, value, data, $dynamicIndex }, this.onLoadCb)
    },
    onLoadCb(cbData) {
      let withConfigData = !validatenull(cbData) ? cloneDeep(cbData) : {}
      if (withConfigData && Object.keys(withConfigData).length) {
        let { data, total } = withConfigData || {}
        // 判断是否为table数据查询
        if (utilHasProto(withConfigData, 'data') && utilHasProto(withConfigData, 'total')) {
          this.setNewTableData({ data, total })
          return
        }
        // 回显
        this.showUserInitData(withConfigData)
      }
    },
    showUserInitData(cbData) { // 展示回显的数据
      let { data } = cbData || {}
      if (validatenull(data)) return
      // 取数做兼容，先拿到传来的，tableProps兜底
      let { labelKey, valueKey, cbLabelKey, cbIdKey } = this.resetEchoConfig(cbData)

      // 判断需要回显的数据类型，区分多选/单选
      let tempInitData = []
      let resultInitData = []
      if (Array.isArray(data)) {
        tempInitData = data.map(i => {
          return { [valueKey]: i[cbIdKey], [labelKey]: i[cbLabelKey] }
        })
      } else if (typeof data === 'object') {
        tempInitData = [{ [valueKey]: data[cbIdKey], [labelKey]: data[cbLabelKey] }]
      }
      // 数据过滤下有效值
      resultInitData = (tempInitData && tempInitData.length) ? tempInitData.filter(i => !validatenull(i)) : []

      this.callBackFlag = false
      this.userSelectedData = resultInitData
    },
    resetEchoConfig(cbData) {
      let { labelKey, valueKey } = this.echoDictConfig

      let cbLabelKey = cbData[labelKey] || labelKey
      let cbIdKey = cbData[valueKey] || valueKey
      return { labelKey, valueKey, cbLabelKey, cbIdKey }
    },
    setNewTableData({ data, total }) { // table数据重新获取
      this.tableData = data || []
      this.pageConfig.total = total || 0
      this.updateSelectedMark()
    },

    // 自定义事件, 上方表单的搜索的参数的回调函数
    handleFormSearch(searchData) {
      this.formSearchData = searchData
      this.pageConfig = basicPageConfig
      this.handleLoadData()
    },
    handleLoadData(newPageConfig) { // table取值
      let { currentPage: newPage, pageSize: newSize } = newPageConfig || {}
      // 页数change
      if (newPage || newPage === 0) {
        this.pageConfig.currentPage = newPage
      }
      // 条数change
      if (newSize || newSize === 0) {
        this.pageConfig.pageSize = newSize
      }
      this.execOnload(this.pageConfig, undefined, this.formSearchData)
    },
    inpGetFocus() { // 点击选择按钮
      this.dialogVisible = true
      if (!this.tableData || !this.tableData.length) this.handleLoadData()
      this.updateSelectedMark()
    },
    updateSelectedMark() {
      // 设置table默认勾中选择的数据
      // 参考https://element.eleme.cn/#/zh-CN/component/table 属性toggleRowSelection/setCurrentRow
      this.$nextTick(
        () => {
          // 取不到table,停止流程
          if (!this.tableRef || !Object.keys(this.tableRef).length) return
          // 根据用户选择的数据，拿到对应tableData初始数据
          let { valueKey } = this.echoDictConfig
          let originTableData = this.userSelectedData ? this.userSelectedData.map(i => i[valueKey]) : []
          originTableData = _filter(this.tableData, (o) => {
            return originTableData.includes(o[valueKey])
          })

          if (!originTableData || !originTableData.length) originTableData = []
          // table勾选设置
          switch (this.sigleSelect) {
            case true:
              this.tableRef.setCurrentRow()
              this.tableRef.setCurrentRow(originTableData[0] || {})
              break
            case false:
              this.tableRef.clearSelection()
              originTableData && originTableData.length && originTableData.forEach(i => this.tableRef.toggleRowSelection(i, true))
              break
          }
        }
      )
    },

    removeUser() { // 删除用户
      if (this.sigleSelect) { // 单选
        this.userSelectedData = []
      }
    },
    assignForForm(formVal) { // 处理表单value
      if (!formVal || !formVal.length) return
      let { formatter: { valFormatter } } = this.baseOptsFromParent
      let { valueKey, labelKey } = this.echoDictConfig
      let result = valFormatter && valFormatter(formVal) || undefined
      // 默认格式
      let nativeResult = result || undefined
      if (!nativeResult) {
        switch (this.sigleSelect) {
          case true:
            nativeResult = _get(formVal, `[0].${valueKey}`, undefined)
            break
          case false:
            nativeResult = formVal.map(i => {
              return {
                [valueKey]: i[valueKey],
                [labelKey]: i[labelKey]
              }
            })
            break
        }
      }
      return nativeResult
    },
    // 对外接口
    refGetSelectData() {
      return this.userSelectedData
    },
    refSetSelectData(newData) {
      this.userSelectedData = newData || []
    }
  }

}
</script>

<style scoped="scoped" lang="scss">
</style>
