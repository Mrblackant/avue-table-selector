<template>
  <div>
    <button @click="handleClick">
      按钮q
    </button>
  </div>
</template>

<script>
export default {
  name: 'basicSwitch',
  methods: {
    handleClick() {
      alert(1)
    }
  }
}
</script>

