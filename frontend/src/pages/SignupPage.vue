<template>
  <q-page class="row items-center justify-evenly">
    <q-card flat bordered class="my-card" style="width: 400px;">
      <q-card-section>
        <div class="text-h5 text-center q-mb-sm custom-font">Регистрация</div>
        <div class="text-caption text-center q-mb-sm custom-font">
          Введите данные для регистрации
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="login"
          label="Логин"
          dense
          outlined
          class="q-mb-sm custom-font"
          placeholder="example@example.com"
          :rules="[val => !!val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Введите корректный email']"
          no-error-icon
        />
        <q-input
          v-model="firstname"
          label="Имя"
          dense
          outlined
          class="q-mb-sm custom-font"
          :rules="[val => !!val && /^[а-яА-ЯёЁa-zA-Z]+$/.test(val) || 'Только буквы']"
          no-error-icon
        />
        <q-input
          v-model="lastname"
          label="Фамилия"
          dense
          outlined
          class="q-mb-sm custom-font"
          :rules="[val => !!val && /^[а-яА-ЯёЁa-zA-Z]+$/.test(val) || 'Только буквы']"
          no-error-icon
        />
        <q-input
          :type="isPwdVisible ? 'text' : 'password'"
          v-model="password"
          label="Пароль"
          dense
          outlined
          class="q-mb-sm custom-font"
          placeholder="**********"
          :rules="[val => !!val && /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(val) || 'Пароль должен содержать хотя бы одну букву, одну цифру и быть не менее 8 символов']"
          no-error-icon
        >
          <template v-slot:append>
            <q-icon
              v-if="password"
              :name="isPwdVisible ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdVisible = !isPwdVisible"
            />
          </template>
        </q-input>
        <q-input
          :type="isPwdVisible ? 'text' : 'password'"
          v-model="confirmPassword"
          label="Подтверждение пароля"
          dense
          outlined
          class="q-mb-sm custom-font"
          placeholder="**********"
          :rules="[val => val === password || 'Пароли не совпадают']"
          no-error-icon
        />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          color="primary"
          label="Зарегистрироваться"
          @click="onSignUp"
          class="full-width q-mb-sm custom-font bold-button"
          :disable="!isFormValid"
        />
      </q-card-actions>

      <q-card-section class="text-center">
        <q-btn
          color="secondary"
          label="Назад"
          flat
          @click="onReturn"
          class="full-width custom-font bold-button"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import * as api from 'src/api/auth.api';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $q = useQuasar();

const login = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstname = ref('');
const lastname = ref('');
const isPwdVisible = ref(false);

const isFormValid = computed(() => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  return (
    login.value &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login.value) &&
    password.value &&
    passwordRegex.test(password.value) &&
    confirmPassword.value === password.value &&
    /^[а-яА-ЯёЁa-zA-Z]+$/.test(firstname.value) &&
    /^[а-яА-ЯёЁa-zA-Z]+$/.test(lastname.value)
  );
});

const onReturn = () => {
  router.push({ path: '/login' });
};

const onSignUp = async () => {
  if (!isFormValid.value) {
    $q.notify({
      message: 'Ошибка валидации',
      caption: 'Пожалуйста, проверьте введенные данные.',
      color: 'red',
      icon: 'error',
    });
    return;
  }

  try {
    const response = await api.signup({
      username: login.value,
      password: password.value,
      firstname: firstname.value,
      lastname: lastname.value,
    });

    if (response && response.success) {
      $q.notify({
        message: 'Пользователь успешно создан',
        caption: 'Можете войти в систему',
        color: 'green',
        icon: 'verified',
      });

      setTimeout(() => {
        router.push({ path: '/login' });
      }, 2000);
    } else {
      $q.notify({
        message: 'Создать пользователя не удалось',
        caption: 'Возможно, пользователь с таким логином уже существует. Попробуйте другой.',
        color: 'red',
        icon: 'error',
      });
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    $q.notify({
      message: 'Ошибка регистрации',
      caption: 'Попробуйте позже или обратитесь к администратору.',
      color: 'red',
      icon: 'error',
    });
  }
};
</script>

<style scoped>
.my-card {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px; /* Уменьшаем поля */
}

.full-width {
  width: 100%;
}

.bold-button {
  font-weight: bold;
}

.custom-font {
  /* font-family: 'Roboto', sans-serif; */
}

/* Убираем отступы после подсказок */
.q-field__messages {
  margin-bottom: 0;
}
</style>

<style>
/* Подключаем шрифт Roboto */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

/* Применяем шрифт ко всему документу */
body {
  font-family: 'Roboto', sans-serif;
}
</style>
