
<template>
  <RouterView />
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { checkSession } from './services/auth/authService.ts';


const validaSesion = async () => {
  const resp = await checkSession();
  console.log(resp);
 };

 onMounted(() => {
  validaSesion();
});

</script>


