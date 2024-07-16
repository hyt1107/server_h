<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
const store = useStore(); //可以在 App.vue 或者任何顶层组件中调用checkuser
onMounted(() => {
  store.dispatch('checkUser');
});
</script>

<template>
    <router-view />
</template>

<style scoped></style>
