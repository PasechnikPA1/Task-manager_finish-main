import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import {
  Competence,
  LoginResponseDto,
  PortfolioDto,
  Role,
  SecuredUser,
  UserAccountStatus,
} from '../../../backend/src/common/types';

export const useMainStore = defineStore('main', () => {
  const state = reactive({
    userId: 0,
    username: 'unknown',
    firstname: 'unknown',
    lastname: 'unknown',
    roles: [] as Role[],
    userStatus: UserAccountStatus,
    group: 'unknown',
    telephone: 'unknown',
    competence: [] as Competence[],
    portfolio: [] as PortfolioDto[],
  });

  // Инициализация состояния приложения
  const initAppState = (appState: LoginResponseDto) => {
    state.userId = appState.userId;
    state.username = appState.username;
    state.firstname = appState.firstname;
    state.lastname = appState.lastname;
    state.roles = appState.roles;
  };

  // Получение текущего пользователя
  const getCurrentUser = (): SecuredUser => {
    return {
      id: state.userId,
      email: state.username,
      firstname: state.firstname,
      lastname: state.lastname,
      group: state.group,
      telephone: state.telephone,
      roles: state.roles,
      status: UserAccountStatus.active,
      competence: state.competence,
      portfolio: state.portfolio,
    };
  };

  // Проверка ролей
  const isAdmin = () => state.roles.some((r) => r === Role.admin);
  const isCustomer = () => state.roles.some((r) => r === Role.customer);
  const isDirectorate = () => state.roles.some((r) => r === Role.directorate);
  const isExpert = () => state.roles.some((r) => r === Role.expert);
  const isUser = () => state.roles.some((r) => r === Role.user);

  // Проверка, может ли пользователь создавать проекты
  const canCreateProject = () => {
    return isAdmin() || isCustomer() || isDirectorate();
  };

  // Проверка, может ли пользователь удалять проекты
  const canDeleteProject = () => {
    return isAdmin() || isCustomer() || isDirectorate();
  };

  return {
    ...toRefs(state),
    initAppState,
    isAdmin,
    isCustomer,
    isDirectorate,
    isExpert,
    isUser,
    canCreateProject,
    canDeleteProject, // Добавляем метод canDeleteProject
    getCurrentUser,
  };
});