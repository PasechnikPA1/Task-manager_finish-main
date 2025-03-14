<template>
    <q-dialog v-model="showDialog" persistent>
      <q-card class="create-project-card">
        <q-card-section>
          <h2 class="dialog-title">Создать новый проект</h2>
        </q-card-section>
  
        <q-card-section>
          <q-input
            v-model="newProject.title"
            label="Название проекта"
            outlined
            class="q-mb-md"
          />
          <q-input
            v-model="newProject.proposedSolution"
            label="Предполагаемое решение"
            outlined
            type="textarea"
            class="q-mb-md"
          />
          <q-input
            v-model="newProject.expectedResult"
            label="Ожидаемый результат"
            outlined
            type="textarea"
            class="q-mb-md"
          />
          <q-input
            v-model="newProject.requiredResources"
            label="Необходимые ресурсы"
            outlined
            type="textarea"
            class="q-mb-md"
          />
          <q-input
            v-model="newProject.teamSize"
            label="Размер команды"
            outlined
            type="number"
            class="q-mb-md"
          />
          <q-select
            v-model="newProject.technologies"
            label="Технологии"
            multiple
            outlined
            :options="technologyOptions"
            class="q-mb-md"
          />
        </q-card-section>
  
        <q-card-actions align="right">
          <q-btn flat label="Отмена" color="primary" @click="closeDialog" />
          <q-btn flat label="Создать" color="primary" @click="createProject" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useMainStore } from 'src/stores/main-store';
  import { storeToRefs } from 'pinia';
  
  interface Project {
    title: string;
    proposedSolution: string;
    expectedResult: string;
    requiredResources: string;
    initiator: string;
    technologies: string[];
    teamSize: number;
    applicationsCount: number;
  }
  
  const showDialog = ref(false);
  const newProject = ref<Project>({
    title: '',
    proposedSolution: '',
    expectedResult: '',
    requiredResources: '',
    initiator: '',
    technologies: [],
    teamSize: 0,
    applicationsCount: 0,
  });
  
  const technologyOptions = ['C#', '.NET 6.0', 'SQLite', 'Git', 'Docker', 'PostgreSQL', 'MySQL', 'C++', 'Python', 'Javascript', 'SpringBoot', 'FireBase', 'Elasticsearch'];
  
  const emit = defineEmits(['create']);
  
  // Получаем данные пользователя из хранилища
  const mainStore = useMainStore();
  const { firstname, lastname } = storeToRefs(mainStore);
  
  const openDialog = () => {
    // Устанавливаем инициатора как авторизованного пользователя
    newProject.value.initiator = `${firstname.value} ${lastname.value}`;
    showDialog.value = true;
  };
  
  const closeDialog = () => {
    showDialog.value = false;
    resetForm();
  };
  
  const createProject = () => {
    emit('create', newProject.value);
    closeDialog();
  };
  
  const resetForm = () => {
    newProject.value = {
      title: '',
      proposedSolution: '',
      expectedResult: '',
      requiredResources: '',
      initiator: '',
      technologies: [],
      teamSize: 0,
      applicationsCount: 0,
    };
  };
  
  defineExpose({
    openDialog,
  });
  </script>
  
  <style scoped>
  .create-project-card {
    width: 500px;
    max-width: 90%;
  }
  
  .dialog-title {
    font-size: 24px;
    margin: 0;
  }
  </style>