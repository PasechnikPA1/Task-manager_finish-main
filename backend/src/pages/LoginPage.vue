<template>

  <q-page class="row items-center justify-evenly">

    <q-card flat bordered class="my-card">

      <q-card-section>

        <div class="text-h6 text-center">Вход</div>

      </q-card-section>

 

      <q-card-section class="q-pt-none">

        <q-input v-model="login" label="Логин" dense />

      </q-card-section>

      <q-card-section class="q-pt-none">

        <q-input type="password" v-model="password" label="Пароль" dense />

      </q-card-section>

 

      <q-card-actions align="around">

        <q-btn color="primary" @click="onLogin">Войти</q-btn>

        <q-btn color="secondary" flat @click="onSignUp">Регистрация</q-btn>

      </q-card-actions>

 

    </q-card>

  </q-page>

</template>

 

<script setup lang="ts">

import { ref } from 'vue';

import { useRouter } from 'vue-router';

import * as api from '../api/auth.api';

import { useMainStore } from 'src/stores/main-store';

import { useQuasar } from 'quasar';

// import { storeToRefs } from 'pinia';

 

const router = useRouter();

const mainStore = useMainStore();

const $q = useQuasar();

// let { initAppState } = storeToRefs(mainStore);

 

const login = ref('');

const password = ref('');

 

const onLogin = async () => {

  let response;

 

  try {

    response = await api.login(login.value, password.value);

 

  } catch {

    console.log('Login failed');

  }

 

  console.log('login: ', response);

 

  if (response) {

    // save user into store

    mainStore.initAppState(response)

    router.push({ path: '/' })

  } else {

    $q.notify({

      message: 'Войти не удалось',

      caption: 'Удостоверьтесь в правильности введеного Вами логина и пароля.',

      color: 'red',

      icon: 'error'

    })

  }

}

 

const onSignUp = () => {

  router.push({ path: '\signup' })

}

 

</script>