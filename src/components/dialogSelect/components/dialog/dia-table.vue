<template>
  <div>
    <el-table
      ref="diaInnerTable"
      highlight-current-row
      :data="tableData"
      border
      empty-text="暂无数据"
      style="height:400px;overflow:auto"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="!sigleSelect"
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="50"
        align="center"
      />
      <el-table-column
        v-for="(item,index) in tableColumn"
        :key="index"
        :align="item.align ? item.align : 'center'"
        :label="item.label"
        :prop="item.prop"
        :min-width="item.minWidth?item.minWidth:'120'"
        :formatter="item.formatter"
      />
    </el-table>
    <!-- 分页 -->
    <div style="text-align: right">
      <el-pagination
        :current-page="pageConfig.currentPage"
        :page-size="pageConfig.pageSize"
        :total="pageConfig.total"
        :page-sizes="pageConfig.pageSizeList"
        layout="prev, pager, next, jumper, ->, sizes, total"
        style="margin: 20px 0px"
        @current-change="currentPageChange"
        @size-change="pageSizeChange"
      />
    </div>
  </div>
</template>

<script>
import { get as _get } from 'lodash'

export default {
  inject: ['mian_this'],
  props: {
  },
  data() {
    return {
      selectedData: []
    }
  },
  computed: {
    tableOption() {
      let formOption = _get(this, 'mian_this.baseOptsFromParent', null)
      return formOption
    },
    tableData() {
      return _get(this, 'mian_this.tableData', [])
    },
    sigleSelect() {
      let mode = _get(this.tableOption, 'tableConfig.selectMode', '')
      mode = !(mode && mode === 'multiple')
      return mode
    },
    tableColumn() {
      return _get(this.tableOption, 'formTableColumnConfig.column', [])
    },
    pageConfig() {
      return _get(this.mian_this, 'pageConfig', {})
    }
  },
  mounted() {
    this.$emit('handleTableRef', this.$refs.diaInnerTable)
  },
  methods: {
    handleCurrentChange(currentRow) { // 单选change，不是单选不用赋值
      if (!this.sigleSelect) return
      this.selectedData = currentRow && Object.keys(currentRow).length ? [currentRow] : []
    },
    handleSelectionChange(val) { // 多选change
      this.selectedData = val
    },
    geTableSelect() { // 取到选中数据
      return this.selectedData || []
    },
    currentPageChange(newPage) { // 当前页change
      this.mian_this.handleLoadData({ currentPage: newPage })
    },
    pageSizeChange(newPageSize) { // size change
      this.mian_this.handleLoadData({ pageSize: newPageSize })
    }
  }
}
</script>

<style scoped>
</style>
