<template>

  <q-layout view="hHh Lpr fFf">

    <q-header elevated>

      <q-toolbar>

        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

 

        <q-toolbar-title>

          Супер Менеджер Задач - ТИУ

        </q-toolbar-title>

 

        <div>

          <q-avatar icon="account_circle" size="xl">

          </q-avatar>

          {{ `${firstname} ${lastname}` }}

          <q-btn icon="logout" color="red" dense unelevated round @click="onLogout()"></q-btn>

        </div>

      </q-toolbar>

    </q-header>

 

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>

      <SideMenu></SideMenu>

    </q-drawer>

 

    <q-page-container>

      <router-view />

    </q-page-container>

  </q-layout>

</template>

 

<script setup lang="ts">

import { ref } from 'vue';

import SideMenu from 'components/SideMenu.vue'

import { useMainStore } from 'src/stores/main-store';

import { storeToRefs } from 'pinia';

import * as api from '../api/auth.api';

import { useRouter } from 'vue-router';

 

defineOptions({

  name: 'MainLayout'

});

 

const mainStore = useMainStore();

const router = useRouter();

 

let { firstname, lastname } = storeToRefs(mainStore);

 

const leftDrawerOpen = ref(false);

 

function toggleLeftDrawer() {

  leftDrawerOpen.value = !leftDrawerOpen.value;

}

 

const onLogout = ()=>{

  api.logout();

  router.push({ path: '/login' })

}

</script>