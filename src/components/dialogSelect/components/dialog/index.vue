
<template>
  <div>
    <el-dialog
      ref="testRef"
      :visible.sync="showDia"
      :title="diaTitle"
      width="80%"
      append-to-body
      @close="cancelConfirm"
    >
      <input
        ref="forPosition"
        style="width: 0;height: 0;opacity: 0;"
      >
      <!-- 弹出框中上方的表单form组件 -->
      <top-from ref="topForm" />
      <!-- 弹出框中下方的表格table组件 -->
      <bottom-table
        ref="bottomTableCom"
        @handleTableRef="ref=>{tableRef=ref}"
      />
      <!-- 弹出框底部的按钮项 -->
      <span slot="footer">
        <el-button
          size="mini"
          @click="cancelConfirm"
        >取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="chooseConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>>

<script>
import { get as _get } from 'lodash'
import topFrom from './dia-form'
import bottomTable from './dia-table'
export default {
  components: {
    topFrom,
    bottomTable
  },
  // props: ['value', 'dialogOption'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDia: false,
      tableRef: null
    }
  },
  computed: {
    diaTitle() {
      let text = _get(this.dialogOption, 'dialogConfig.title', '')
      text = !text ? '请选择' : '请选择' + text
      return text
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) this.makeTargetInp()
      this.showDia = newVal
    },
    tableRef(newVal) {
      if (newVal) this.$emit('handleTableRef', newVal || null)
    }

  },
  mounted() {
  },
  methods: {
    makeTargetInp() {
      this.$nextTick(() => {
        let target = this.$refs.forPosition
        target && target.focus()
      })
    },
    singleInpFocus() {
      this.$refs.singleInput.blur()
      this.$emit('inpGetFocus')
    },
    removeUser() {
      this.$emit('removeUser')
    },
    cancelConfirm() { // 弹窗-取消
      this.$emit('update:visible', false)
    },
    chooseConfirm() { // 弹窗-确定btn
      const { bottomTableCom: $tableCom } = this.$refs || {}
      if ($tableCom) {
        let userSelectedData = $tableCom.geTableSelect && $tableCom.geTableSelect() || []
        this.$emit('updateData', userSelectedData)
        this.cancelConfirm()
      }
    }

  }
}
</script>

<style scoped>
</style>

