<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="arrow_drop_down" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="row items-center q-gutter-sm justify-left">
          <q-avatar icon="account_circle" size="xl" />
          <span>{{ `${firstname} ${lastname}` }}</span>
        </q-toolbar-title>

        <div class="q-mr-md">
          <q-btn flat label="Проекты" @click="goToProjects" />
          <q-btn flat label="Идеи" @click="goToIdeas" />
          <q-btn flat label="Команды" @click="goToTeams" /> <!-- Обновленная кнопка -->
        </div>

        <div>
          <q-btn icon="logout" color="blue" dense unelevated round @click="onLogout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area style="height: 100%">
        <div class="q-pa-md">
          <!-- Role Selection -->
          <div class="q-mb-md">
            <div class="text-h6">Выберите роль</div>
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Студент</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Заказчик</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Эксперт</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Дирекция ВШЦТ</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Администратор</q-item-section>
              </q-item>
            </q-list>
          </div>

          <SideMenu />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SideMenu from 'components/SideMenu.vue';
import { useMainStore } from 'src/stores/main-store';
import { storeToRefs } from 'pinia';
import * as api from '../api/auth.api';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'MainLayout',
});

const mainStore = useMainStore();
const router = useRouter();

let { firstname, lastname } = storeToRefs(mainStore);

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

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
  router.push('/teams'); // Переход на страницу команд
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
</style>