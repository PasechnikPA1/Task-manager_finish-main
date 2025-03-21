<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="row items-center q-gutter-sm justify-left">
          <!-- Аватар без обработчика клика -->
          <q-avatar icon="account_circle" size="xl" />

          <!-- Имя и фамилия с обработчиком клика и стилями -->
          <span
            class="clickable-name"
            @click="openUserProfile"
          >
            {{ `${firstname} ${lastname}` }}
          </span>

          <!-- Роли -->
          <span v-if="formattedRoles.length > 0">
            {{ formattedRoles.length > 1 ? ', ' : ' ' }}
            {{ formattedRoles.join(', ') }}
          </span>
        </q-toolbar-title>

        <div class="q-mr-md">
          <q-btn flat label="Проекты" @click="goToProjects" />
          <q-btn flat label="Идеи" @click="goToIdeas" />
          <q-btn flat label="Команды" @click="goToTeams" />
        </div>

        <div>
          <q-btn icon="logout" color="blue" dense unelevated round @click="onLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Передаем formattedRoles в UserProfile -->
    <UserProfile ref="userProfile" :roles="formattedRoles" />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMainStore } from 'src/stores/main-store';
import { storeToRefs } from 'pinia';
import * as api from '../api/auth.api';
import { useRouter } from 'vue-router';
import UserProfile from './UserProfile.vue';

defineOptions({
  name: 'MainLayout',
});

const mainStore = useMainStore();
const router = useRouter();
const userProfile = ref();

let { firstname, lastname, roles } = storeToRefs(mainStore);

const formattedRoles = computed(() => {
  return roles.value.map((role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'customer':
        return 'Заказчик';
      case 'directorate':
        return 'Дирекция ВШЦТ';
      case 'expert':
        return 'Эксперт';
      case 'user':
        return 'Студент';
      default:
        return role;
    }
  });
});

const onLogout = () => {
  api.logout();
  router.push({ path: '/login' });
};

const goToProjects = () => {
  router.push('/projects');
};

const goToIdeas = () => {
  router.push('/ideas');
};

const goToTeams = () => {
  router.push('/teams');
};

const openUserProfile = () => {
  userProfile.value.open();
};
</script>

<style scoped>
.q-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.q-mr-md {
  margin-right: 16px;
}

/* Стили для кликабельного имени и фамилии */
.clickable-name {
  cursor: pointer;
  color: rgb(255, 255, 255); /* Черный цвет текста */
  transition: color 0.3s ease;
}

.clickable-name:hover {
  color: #1d0101; /* Цвет при наведении (например, синий) */
}
</style>