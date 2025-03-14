import { defineStore } from 'pinia';

import { reactive, toRefs } from 'vue';

import { LoginResponseDto, Role } from '../common/types';

 

export const useMainStore = defineStore('main', () => {

  const state = reactive({

    userId: 0,

    username: 'unknown',

    firstname: 'unknown',

    lastname: 'unknown',

    roles: [] as Role[],

  });

 

  const initAppState = (appState: LoginResponseDto) => {

    state.username = appState.username;

    state.firstname = appState.firstname;

    state.lastname = appState.lastname;

    state.roles = appState.roles;

  };

 

  const isAdmin = () => state.roles.some((r) => r == Role.admin);

  const isUser = () => state.roles.some((r) => r == Role.user);

 

  return {

    ...toRefs(state),

    initAppState,

    isAdmin,

    isUser,

  };

});
