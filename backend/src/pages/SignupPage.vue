<template>

  <q-page class="row items-center justify-evenly">

    <q-card flat bordered class="my-card">

      <q-card-section>

        <div class="text-h6 text-center">Регистрация нового пользователя</div>

      </q-card-section>

 

      <q-card-section class="q-pt-none">

        <q-input v-model="login" label="Логин" dense />

      </q-card-section>

      <q-card-section class="q-pt-none">

        <q-input type="password" v-model="password" label="Пароль" dense />

      </q-card-section>

      <q-card-section class="q-pt-none">

        <q-input v-model="firstname" label="Имя" dense />

      </q-card-section>

      <q-card-section class="q-pt-none">

        <q-input v-model="lastname" label="Фамилия" dense />

      </q-card-section>

 

      <q-card-actions align="around">

        <q-btn color="primary" @click="onSignUp">Регистрация</q-btn>

        <q-btn color="secondary" flat @click="onReturn">Назад</q-btn>

      </q-card-actions>

 

    </q-card>

  </q-page>

</template>

 

<script setup lang="ts">

import { useQuasar } from 'quasar';

import * as api from 'src/api/auth.api';

import { ref } from 'vue';

import { useRouter } from 'vue-router';

 

const router = useRouter();

 

const $q = useQuasar();

 

const login = ref('');

const password = ref('');

const firstname = ref('');

const lastname = ref('');

 

const onReturn = () => {

  router.push({ path: '\login' })

}

 

const onSignUp = async () => {

  let response;

 

  try {

    response = await api.signup({ username: login.value, password: password.value, firstname: firstname.value, lastname: lastname.value });

  } catch {

    console.log('Signup failed');

  }

 

  if (response && response.success) {

 

    $q.notify({

      message: 'Пользователь успешно создан',

      caption: 'Ожидайте активации пользователя администратором.',

      color: 'green',

      icon: 'verified'

    })

 

    router.push({ path: '/login' })

  } else {

    $q.notify({

      message: 'Создать пользователя не удалось',

      caption: 'Возможно, пользователь с таким логином уже существует. Попробуйте другой.',

      color: 'red',

      icon: 'error'

    })

  }

}

 

</script>