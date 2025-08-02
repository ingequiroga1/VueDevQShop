
<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { checkSession } from './services/auth/authService.ts';


const validaSesion = async () => {
  await checkSession();
 };

 onMounted(() => {
  validaSesion();
});

</script>


