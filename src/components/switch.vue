<template>
  <div>
    <button @click="handleClick">
      按钮q
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

