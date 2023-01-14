<template>
  <div v-if="Test">
    <h1>{{ compsname }}</h1>
    <Test />
  </div>
</template>
<script setup>
import Test from "./test.vue";
const compsname = Test.name;
</script>
