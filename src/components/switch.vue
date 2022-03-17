<template>
  <div>
    <button @click="handleClick">
      按钮change my mind
    </button>
  </div>
</template>

<script>
export default {
  name: 'vueSwitch',
  methods: {
    handleClick() {
      alert(1)
    }
  }
}
</script>

