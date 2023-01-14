<route lang="yaml">
name: test-view
# defname: second
</route>
<template>
  <div>
    <div>"F5" or click to check component name</div>
    <button type="" @click="check">check</button>
  </div>
</template>
<script setup lang="ts">
// defname("first");
function check() {
  window.location.reload();
}
</script>
<style scoped></style>
