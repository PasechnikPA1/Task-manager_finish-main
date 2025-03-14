<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { refresh } from './api/auth.api'
import { useMainStore } from './stores/main-store';
import { onMounted } from 'vue';
import { api } from './api/axios';
import { useQuasar } from 'quasar';

defineOptions({
  name: 'App'
});

const router = useRouter();
const mainStore = useMainStore();
const $q = useQuasar();


onMounted(async () => {
  const savedSession = await refresh();

  if (savedSession) {
    // save user into store
    mainStore.initAppState(savedSession)
  } else {
    router.push({ path: '/login' })
  }
})

api.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response && error.response.status == 401) {
    $q.notify({
      type: 'negative',
      position: 'bottom',
      message: 'Ошибка авторизации',
      icon: 'self_improvement',
      timeout: 2000
    });
    router.push({ path: '/login' })
  }
  return Promise.reject(error);
})

</script>
