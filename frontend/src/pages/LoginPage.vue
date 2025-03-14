<template>
  <q-page class="row items-center justify-evenly">
    <q-card flat bordered class="my-card" style="width: 400px; padding: 20px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-md">Авторизация</div>
        <div class="text-caption text-center q-mb-md">
          Введите адрес электронной почты и пароль
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="login"
          label="Логин"
          dense
          outlined
          class="q-mb-md"
          placeholder="almamun_uxui@std.tyulu.ru"
        />
        <q-input
          type="password"
          v-model="password"
          label="Пароль"
          dense
          outlined
          class="q-mb-md"
          placeholder="**********"
        />
      </q-card-section>

      <q-card-section class="q-pt-none text-center">
        <a href="#" class="text-caption" @click.prevent="onForgotPassword">
          Забыли пароль?
        </a>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          color="primary"
          label="Войти"
          @click="onLogin"
          class="full-width q-mb-md"
        />
      </q-card-actions>

      <q-card-section class="text-center">
        <q-btn
          color="secondary"
          label="Регистрация"
          flat
          @click="onSignUp"
          class="full-width"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as api from '../api/auth.api';
import { useMainStore } from 'src/stores/main-store';
import { useQuasar } from 'quasar';

const router = useRouter();
const mainStore = useMainStore();
const $q = useQuasar();

const login = ref('');
const password = ref('');

const onLogin = async () => {
  let response;

  try {
    response = await api.login(login.value, password.value);
  } catch {
    console.log('Login failed');
  }

  if (response) {
    mainStore.initAppState(response);
    router.push({ path: '/' });
  } else {
    $q.notify({
      message: 'Войти не удалось',
      caption: 'Удостоверьтесь в правильности введеного Вами логина и пароля.',
      color: 'red',
      icon: 'error',
    });
  }
};

const onSignUp = () => {
  router.push({ path: '/signup' });
};

const onForgotPassword = () => {
  console.log('Забыли пароль?');
};
</script>

<style scoped>
.my-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif; /* Применяем шрифт Roboto */
}

.full-width {
  width: 100%;
}
</style>